<template>
  <v-app>
    <v-app-bar app color="#2979FF" dense dark>
      <v-spacer />
      <v-toolbar-title v-if="this.$route.name == 'Accueil'">{{this.$route.name}}</v-toolbar-title>
      <v-toolbar-title v-else-if="initialLoading">Chargement...</v-toolbar-title>
      <v-toolbar-title v-else-if="newDoc">Nouveau {{this.$route.name}}</v-toolbar-title>
      <v-toolbar-title v-else>{{this.$route.name}} N° {{refDoc}}</v-toolbar-title>
      <v-spacer />
    </v-app-bar>
    <v-content v-if="initialLoading">
      <v-container fill-height fluid>
        <v-row align="center" justify="center">
          <v-col>
            <div class="text-center">
              <v-progress-circular size="80" width="6" indeterminate color="primary"></v-progress-circular>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <v-content v-else>
      <router-view></router-view>
    </v-content>
    <v-snackbar v-model="displaySuccessMessage" color="success" :timeout="5000">
      {{ successMessage }}
      <v-btn dark text @click="displaySuccessMessage = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
    <v-snackbar v-model="displayErrorMessage" color="error" :timeout="15000">
      {{ errorMessage }}
      <v-btn dark text @click="displayErrorMessage = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import EditionDocument from "./components/EditionDocument.vue";

@Component({
  components: { EditionDocument }
})
export default class App extends Vue {
  @Getter("documentModule/getIsNewDoc")
  private newDoc!: boolean;
  @Getter("documentModule/getRefDoc")
  private refDoc!: string;
  @Getter("documentModule/initialLoading")
  private initialLoading!: boolean;

  @Getter("messagesModule/successMessage")
  private successMessage!: string;
  @Getter("messagesModule/errorMessage")
  private errorMessage!: string;

  @Action("messagesModule/displaySuccessMessage")
  private actionDisplaySuccessMessage: any;
  @Action("messagesModule/displayErrorMessage")
  private actionDisplayErrorMessage: any;

  get displaySuccessMessage() {
    return this.$store.state.messagesModule.displaySuccessMessage;
  }
  set displaySuccessMessage(value: boolean) {
    this.actionDisplaySuccessMessage(value);
  }

  get displayErrorMessage() {
    return this.$store.state.messagesModule.displayErrorMessage;
  }
  set displayErrorMessage(value: boolean) {
    this.actionDisplayErrorMessage(value);
  }

  private created() {
    this.$store.dispatch('clientModule/refreshCustomersList');
    this.$store.commit(
      "messagesModule/setMessageClientNotFound",
      "Veuillez entrer un numéro de client"
    );
  }
}
</script>
<style>
.input-top-table {
  height: 50px;
  font-size: 12pt;
  width: auto;
}
.width-table {
  max-width: 1400px;
}
.min-height {
  height: 50px;
  margin-top: -8px;
}
.min-width {
  min-width: 100px;
  width: 100px;
}
</style>
