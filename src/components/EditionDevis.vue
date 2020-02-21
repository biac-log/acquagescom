<template>
  <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col cols="12" lg="2" md="3">
          <v-text-field v-model="clientId" label="Numéro client" required></v-text-field>
        </v-col>
        <v-col cols="12" lg="2" md="3">
          <v-text-field v-model="libelle" label="Nom - Prénom" required></v-text-field>
        </v-col>
        <v-col cols="12" lg="2" md="3">
          <v-text-field v-model="devisId" label="Numéro devis" required></v-text-field>
        </v-col>
        <v-col cols="12" lg="2" md="3">
          <v-text-field v-model="date" :rules="dateValide" label="Date" required></v-text-field>
        </v-col>
        <v-col cols="12" lg="2" md="3">
          <v-text-field v-model="demandeur" label=" Devis demandé par"></v-text-field>
        </v-col>
        <v-col cols="12" lg="2" md="3">
          <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
        </v-col>
      </v-row>
    </v-container>
    <v-footer absolute>Guid du document : {{$route.params.guid}}</v-footer>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class EditionDevis extends Vue {
  @Prop() private guid!: string;

  private emailRules = [
    (v: any) => this.isEmailValid(v) || "L'adresse mail n'est pas valide"
  ];

  private isEmailValid(mail: string): boolean {
    if (mail == null || mail == "") return true;
    const regexp = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return regexp.test(mail);
  }
}
</script>
