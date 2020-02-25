<template>
  <v-container>
    <ZoneEdition></ZoneEdition>
  </v-container>
</template>

<script lang="ts">
/* eslint-disable */
import { Component, Vue, Prop } from "vue-property-decorator";
import ZoneEdition from "./ZoneEdition.vue";

@Component({components: { ZoneEdition }})
export default class EditionDevis extends Vue {

}
</script>
