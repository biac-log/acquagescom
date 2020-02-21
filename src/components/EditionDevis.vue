<template>
  <v-container>
    <v-footer>{{guid}}</v-footer>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class EditionDevis extends Vue {

  @Prop() private guid!: string;
}
</script>
