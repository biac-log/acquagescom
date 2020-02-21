<template>
  <v-app>
    <v-app-bar app color="#2979FF" dense dark>
      <v-spacer />
      <v-toolbar-title>AcQuaGesCom - {{this.$route.name}}</v-toolbar-title>
      <v-spacer />
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import EditionDevis from "./components/EditionDevis.vue";

@Component({
  components: { EditionDevis }
})
export default class App extends Vue {}
</script>
