<template>
  <v-container>
    <v-card class="mx-auto">
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          clearable
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="customers"
        :items-per-page="10"
        :loading="loading"
        :search="search"
        :mobile-breakpoint="300"
        :custom-filter="customFilter"
        disable-sort
        @click:row="sendClient"
        class="elevation-1"
        no-data-text="La liste est vide"
        :footer-props="{ 'items-per-page-options': [10, 25, 50],
                      	 'items-per-page-text': ''}"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.numero }}</td>
          <td>{{ props.item.nom }}</td>
          <td>{{ props.item.telephone }}</td>
          <td>{{ props.item.codePostal }}</td>
        </template>
      </v-data-table>
      <v-alert :value="errorMessage != ''" type="warning" border="left" dismissible>{{ errorMessage }}</v-alert>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { State, Action, Getter } from "vuex-class";
import { Component, Vue, Emit } from "vue-property-decorator";
import { Compte } from "@/datas/Compte";

@Component({})
export default class SearchCustomers extends Vue {
  private search = "";
  private loading = false;

  @Getter("documentModule/errorMessage")
  private errorMessage!: string;
  @Getter("documentModule/getCustomers")
  private customers!: Compte[];

  private headers = [
    { text: "Numero", value: "numero" },
    { text: "Nom", value: "nom" },
    { text: "Tel.", value: "telephone" },
    { text: "Code postal", value: "codePostal" }
  ];

  //On passe dans le filtre pour chaques valeurs présente dans chaques row
  //on test en même temps le codeEAN non affiché
  public customFilter(value: string, search: string, item: Compte) {
    return (
      search != null &&
      item != null &&
      value != null &&
      value
        .toString()
        .toUpperCase()
        .indexOf(search.toUpperCase()) !== -1
    );
  }

  @Emit("elementClick")
  private sendClient(client: Compte) {
    return client;
  }
}
</script>
