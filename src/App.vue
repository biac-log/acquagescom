<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
          <v-toolbar-title >{{this.$route.name}}</v-toolbar-title>
      </div>
    </v-app-bar>

    <v-content>
      <EditionDevis />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import EditionDevis from "./components/EditionDevis.vue";

@Component({
  components: { EditionDevis }
})
export default class App extends Vue{
  public guid : string | null= '';

  private created(){
    const response = this.$route.query.guid;
  }
};
</script>
