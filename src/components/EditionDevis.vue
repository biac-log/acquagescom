<template>
  <v-container>
    <ZoneEdition></ZoneEdition>
    <GrilleArticles></GrilleArticles>
    <v-footer color="white" absolute class="overline">
      <v-spacer></v-spacer>
      {{$route.params.guid}}
    </v-footer>
  </v-container>
</template>

<script lang="ts">
/* eslint-disable */
import { Component, Vue, Prop } from "vue-property-decorator";
import ZoneEdition from "./ZoneEdition.vue";
import GrilleArticles from "./GrilleArticles.vue";

@Component({ components: { ZoneEdition, GrilleArticles } })
export default class EditionDevis extends Vue {}
</script>
