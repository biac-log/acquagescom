<template>
  <v-app>
    <v-app-bar app color="#2979FF" dense dark>
      <v-spacer />
      <v-toolbar-title v-if="this.$route.name == 'Accueil'">{{this.$route.name}}</v-toolbar-title>
      <v-toolbar-title v-else-if="newDoc">Création {{this.$route.name}}</v-toolbar-title>
      <v-toolbar-title v-else>Modification {{this.$route.name}} N° {{refDoc}}</v-toolbar-title>
      <v-spacer />
    </v-app-bar>

    <v-content>
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
import EditionDevis from "./components/EditionDevis.vue";

@Component({
  components: { EditionDevis }
})
export default class App extends Vue {
  @Getter("documentModule/getIsNewDoc")
  private newDoc!: boolean;
  @Getter("documentModule/getRefDoc")
  private refDoc!: string;
  @Action("documentModule/displaySuccessMessage")
  private actionDisplaySuccessMessage: any;
  @Action("documentModule/displayErrorMessage")
  private actionDisplayErrorMessage: any;

  @Getter("documentModule/successMessage")
  private successMessage!: string;
  @Getter("documentModule/errorMessage")
  private errorMessage!: string;

  get displaySuccessMessage() {
    return this.$store.state.documentModule.displaySuccessMessage;
  }
  set displaySuccessMessage(value: boolean) {
    this.actionDisplaySuccessMessage(value);
  }
  get displayErrorMessage() {
    return this.$store.state.documentModule.displayErrorMessage;
  }
  set displayErrorMessage(value: boolean) {
    this.actionDisplayErrorMessage(value);
  }

  private created() {
    this.$store.commit(
      "documentModule/setMessageClientNotFound",
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
