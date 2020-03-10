<template>
  <v-row class="mt-12">
    <v-spacer />
    <v-icon large color="orange" class="mr-5">mdi-alert-circle</v-icon>
    <span class="red--text title">Aucun document chargé</span>
    <v-spacer />
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class EditionDocument extends Vue {}
</script>