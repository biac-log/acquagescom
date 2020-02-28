<template>
  <v-app>
    <v-app-bar app color="#2979FF" dense dark>
      <v-spacer />
      <!-- <v-toolbar-title v-if="newDoc">AcQuaGesCom - Création {{this.$route.name}}</v-toolbar-title>
      <v-toolbar-title v-else>AcQuaGesCom - Modification {{this.$route.name}} N° {{refDoc}}</v-toolbar-title> -->
      <v-toolbar-title>AcQuaGesCom - Création {{this.$route.name}}</v-toolbar-title>
      <v-spacer />
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Getter } from "vuex-class";
import EditionDevis from "./components/EditionDevis.vue";

@Component({
  components: { EditionDevis }
})
export default class App extends Vue {

  // @Getter("documentModule/getIsNewDoc")
  // private newDoc!: boolean;
  // @Getter("documentModule/getRefDoc")
  // private refDoc!: string;

  // private created() {
  //   this.$store.dispatch('documentModule/reloadAllDatas');
  // }
}
</script>
<style>
.input-top-table {
  height: 50px;
  font-size: 12pt;
  width: auto;
}
.width-table{
  max-width: 1400px;
}
.min-height {
  height: 50px;
  margin-top: -8px;
}
.min-width{
  min-width: 100px;
  width: 100px;
}
</style>
