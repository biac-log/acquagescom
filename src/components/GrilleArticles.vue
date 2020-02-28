<template>
  <v-data-table
    class="mt-n5"
    :headers="headers"
    @click:row="editItem"
    :items="articles"
    max-width="1000"
    :footer-props="{ 'items-per-page-options': [10, 25, 50],
                      	 'items-per-page-text': 'Articles par page'}"
  >
    <template v-slot:item.prix="{ item }">
      <span>{{(+(item.prixUnitaire)).toLocaleString("fr-FR", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}} €</span>
    </template>
    <template v-slot:item.prixTotal="{ item }">
      <span>{{item.prixTotal.toLocaleString("fr-FR", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}} €</span>
    </template>
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-dialog v-model="dialog" max-width="800px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">Nouvel article</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container @keypress.enter="save">
                <v-row>
                  <v-col cols="12" sm="6" md="2">
                    <v-text-field
                      v-on:focus="$event.target.select()"
                      ref="quantiteField"
                      v-model.number="editedItem.quantite"
                      label="Quantite"
                      autofocus
                      @focus="$event.target.select()"
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="8">
                    <v-text-field v-model="editedItem.libelle" label="Description"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="2">
                    <v-text-field v-model.number="editedItem.prixUnitaire" type="number" label="Prix/unité"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="deleteItem(editedItem)">Supprimer</v-btn>
              <v-btn color="blue darken-1" text @click="close">Annuler</v-btn>
              <v-btn color="blue darken-1" text @click="save">Enregistrer</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-row>
          <v-spacer></v-spacer>
          <span class="mt-5 mr-2">Total HTVA</span>
          <v-col cols="12" lg="2">
            <v-text-field
              class="mt-n1 mr-2 input-top-table"
              solo
              readonly
              reverse
              prefix="€"
              :value="prixTotalHTVA.toFixed(2)"
            ></v-text-field>
          </v-col>
          <span class="mt-5 mr-2">Total TVA</span>
          <v-col cols="12" lg="2">
            <v-text-field
              class="mt-n1 mr-2 input-top-table"
              solo
              readonly
              reverse
              prefix="€"
              :value="totalTVA.toFixed(2)"
            ></v-text-field>
          </v-col>
          <span class="mt-5 mr-2 font-weight-bold text-align-right">Prix total TVAC</span>
          <v-col cols="12" lg="2">
            <v-text-field
              class="mt-n1 mr-n2 input-top-table font-weight-bold text-align-right"
              solo
              readonly
              reverse
              prefix="€"
              :value="prixTotalTVAC.toFixed(2)"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-toolbar>
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
      <v-icon small @click.stop="deleteItem(item)">mdi-delete</v-icon>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { DocumentDetail } from "@/datas/DocumentDetail";
import Sortable from "sortablejs";
const MODULE_NAME = "documentModule";
const TVA = 17;

@Component({})
export default class ZoneEdition extends Vue {
  @Getter(`${MODULE_NAME}/getArticles`)
  private articles!: DocumentDetail[];

  private dialog = false;
  private editedIndex = -1;

  private headers = [
    {
      text: "Quantité",
      value: "quantite",
      width: 50,
      sortable: false,
      align: "right"
    },
    { text: "Description", value: "libelle", sortable: false },
    {
      text: "Prix / unité",
      value: "prixUnitaire",
      width: 150,
      sortable: false,
      align: "right"
    },
    {
      text: "Prix total",
      value: "prixTotal",
      width: 150,
      sortable: false,
      align: "right"
    },
    {
      text: "Actions",
      value: "action",
      sortable: false,
      width: 30,
      align: "center"
    }
  ];

  private formTitle = "Nouvel article";
  private editedItem = {
    quantite: 1,
    libelle: "",
    prixUnitaire: 0,
    prixTotal: 0,
    tauxTva: 0
  };
  private defaultItem = {
    quantite: 1,
    libelle: "",
    prixUnitaire: 0,
    prixTotal: 0,
    tauxTva: 0
  };
  @PropSync("totalHtva")
  private prixTotalHTVA!: number;
  @PropSync("TvaTot")
  private totalTVA!: number;
  @PropSync("totalTvac")
  private prixTotalTVAC!: number;

  // private mounted() {
  //   const table = document.querySelector(".v-data-table tbody");
  //   const that = this;
  //   Sortable.create(table as HTMLElement, {
  //     onEnd({ newIndex, oldIndex }) {
  //       const rowSelected = that.articles.splice(oldIndex || -1, 1)[0];
  //       that.articles.splice(newIndex || -1, 0, rowSelected);
  //       that.$store.dispatch(`${MODULE_NAME}/saveArticles`, that.articles);
  //     }
  //   });
  // }

  private editItem(item: DocumentDetail) {
    this.formTitle = "Modification article";
    this.editedIndex = this.articles.indexOf(item);
    this.editedItem = Object.assign({}, item);
    this.dialog = true;
    this.$store.dispatch(`${MODULE_NAME}/saveArticles`, this.articles);
    this.$emit("calculPrix");
  }

  private deleteItem(item: DocumentDetail) {
    const index = this.articles.indexOf(item);
    confirm("Êtes-vous sûr de vouloir supprimer cet article ?") &&
      this.articles.splice(index, 1);
    this.$store.dispatch(`${MODULE_NAME}/saveArticles`, this.articles);
    this.dialog = false;
    this.$emit("calculPrix");
  }

  private close() {
    this.dialog = false;
    this.formTitle = "Nouvel article";
    setTimeout(() => {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    }, 300);
  }

  private save() {
    this.editedItem.prixTotal = this.editedItem.prixUnitaire * this.editedItem.quantite;
    this.editedItem.tauxTva = TVA;
    if (this.editedIndex > -1) {
      Object.assign(this.articles[this.editedIndex], this.editedItem);
      this.close();
    } else {
      this.articles.push(this.editedItem);
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
      (this.$refs.quantiteField as HTMLInputElement).focus();
    }
    this.$store.dispatch(`${MODULE_NAME}/saveArticles`, this.articles);
    this.$emit("calculPrix");
  }
}
</script>
<style>
.input-top-table {
  height: 50px;
  font-size: 12pt;
  width: auto;
}
</style>