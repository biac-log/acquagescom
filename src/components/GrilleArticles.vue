<template>
  <v-container fluid class="width-table">
    <v-data-table
      class="mt-n5 ml-5 mr-2"
      :headers="headers"
      @click:row="editItem"
      :items="articles"
      :footer-props="{
        'items-per-page-options': [10, 25, 50],
        'items-per-page-text': 'Articles par page'
      }"
    >
      <template v-slot:item.upDown="{ item }">
        <v-icon :disabled="isFirstItem(item)" @click.stop="moveUp(item)"
          >mdi-chevron-up</v-icon
        >
        <v-icon :disabled="isLastItem(item)" @click.stop="moveDown(item)"
          >mdi-chevron-down</v-icon
        >
      </template>
      <template v-slot:item.quantite="{ item }">
        <span>{{ numberToString(item.quantite, item.typeDetail) }}</span>
      </template>
      <template v-slot:item.tauxTva="{ item }">
        <span>{{ numberToString(item.tauxTva, item.typeDetail) }}</span>
      </template>
      <template v-slot:item.prixUnitaire="{ item }">
        <span>{{ numberToEuro(item.prixUnitaire, item.typeDetail) }}</span>
      </template>
      <template v-slot:item.prixTotal="{ item }">
        <span>{{ numberToEuro(item.prixTotal, item.typeDetail) }}</span>
      </template>
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-dialog
            v-model="dialog"
            max-width="800px"
            min-width="400px"
            @keydown.esc="close"
          >
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2 ml-n4" v-on="on"
                >Nouvel article</v-btn
              >
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container @keypress.enter="save">
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        auto-select-first
                        :items="editMode"
                        v-model="editedItem.typeDetail"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                      md="2"
                      v-if="editedItem.typeDetail != 'Texte'"
                    >
                      <v-text-field
                        ref="quantiteField"
                        v-model.number="editedItem.quantite"
                        label="Quantite"
                        autofocus
                        type="number"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="7">
                      <v-text-field
                        v-model="editedItem.description"
                        label="Description"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="2"
                      v-if="editedItem.typeDetail != 'Texte'"
                    >
                      <v-text-field
                        v-model.number="editedItem.prixUnitaire"
                        type="number"
                        label="Prix/unité"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="1"
                      v-if="editedItem.typeDetail != 'Texte'"
                    >
                      <v-text-field
                        v-model.number="editedItem.tauxTva"
                        type="number"
                        label="TVA"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="deleteItem(editedItem)"
                  >Supprimer</v-btn
                >
                <v-btn color="blue darken-1" text @click="close">Annuler</v-btn>
                <v-btn color="blue darken-1" text @click="save"
                  >Enregistrer</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-spacer></v-spacer>

          <v-text-field
            v-model.number="tva"
            type="number"
            label="Base TVA"
            dense
            class="mb-0 mr-0 mt-4 shrink"
          ></v-text-field>
          <v-btn color="primary" dark class="ma-2" @click="recalculTva"
            >Appliquer</v-btn
          >
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small @click.stop="deleteItem(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <v-row class="mr-0 my-1">
      <v-spacer></v-spacer>
      <v-col cols="12" lg="3">
        <span class="mr-1">Total HTVA :</span>
        <span class="float-right"
          >{{
            prixTotalHTVA.toLocaleString("fr-FR", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2
            })
          }}
          €</span
        >
      </v-col>
      <v-divider vertical />
      <v-col cols="12" lg="3">
        <span class="mr-1">Total TVA :</span>
        <span class="float-right"
          >{{
            totalTVA.toLocaleString("fr-FR", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2
            })
          }}
          €</span
        >
      </v-col>
      <v-divider vertical />
      <v-col cols="12" lg="3" class="font-weight-bold">
        <span class="mr-1">Prix total TTC :</span>
        <span class="float-right"
          >{{
            prixTotalTVAC.toLocaleString("fr-FR", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2
            })
          }}
          €</span
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { DocumentDetail } from "@/datas/DocumentDetail";
import Sortable from "sortablejs";

@Component({})
export default class ZoneEdition extends Vue {
  @Getter(`documentModule/getArticles`)
  private articles!: DocumentDetail[];

  private dialog = false;
  private editedIndex = -1;
  private tva = 17;

  private headers = [
    {
      text: "",
      value: "upDown",
      sortable: false,
      width: 10,
      align: "left"
    },
    {
      text: "Quantité",
      value: "quantite",
      width: 40,
      sortable: false,
      align: "right"
    },
    { text: "Type", value: "typeDetail", sortable: false },
    { text: "Description", value: "description", sortable: false },
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
      text: "Taux TVA",
      value: "tauxTva",
      width: 90,
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

  private editMode = ["Article", "Option", "Texte"];

  private formTitle = "Nouvel article";
  private editedItem = {
    typeDetail: "Article",
    numeroLigne: 0,
    quantite: 1,
    description: "",
    prixUnitaire: 0,
    prixTotal: 0,
    tauxTva: this.tva
  };
  private defaultItem = {
    typeDetail: "Article",
    numeroLigne: 0,
    quantite: 1,
    description: "",
    prixUnitaire: 0,
    prixTotal: 0,
    tauxTva: this.tva
  };

  @PropSync("totalHtva")
  private prixTotalHTVA!: number;
  @PropSync("TvaTot")
  private totalTVA!: number;
  @PropSync("totalTvac")
  private prixTotalTVAC!: number;

  private mounted() {
    this.$emit("calculPrix");
  }

  private recalculTva() {
    this.articles.forEach(element => {
      element.tauxTva = this.tva;
    });
    this.$store.dispatch(`documentModule/saveArticles`, this.articles);
    this.$emit("calculPrix");
  }

  private editItem(item: DocumentDetail) {
    this.formTitle = "Modification article";
    this.editedIndex = this.articles.indexOf(item);
    this.editedItem = Object.assign({}, item);
    this.dialog = true;
    this.$store.dispatch(`documentModule/saveArticles`, this.articles);
    this.$emit("calculPrix");
  }

  private deleteItem(item: DocumentDetail) {
    const index = this.articles.indexOf(item);
    confirm("Êtes-vous sûr de vouloir supprimer cet article ?") &&
      this.articles.splice(index, 1);
    this.$store.dispatch(`documentModule/saveArticles`, this.articles);
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
    if (this.editedItem.typeDetail == "Texte") {
      this.editedItem.quantite = 0;
      this.editedItem.prixUnitaire = 0;
      this.editedItem.tauxTva = 0;
    }

    this.editedItem.prixTotal =
      this.editedItem.prixUnitaire * this.editedItem.quantite;
    if (this.editedIndex > -1) {
      Object.assign(this.articles[this.editedIndex], this.editedItem);
      this.close();
    } else {
      this.articles.push(this.editedItem);
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
      (this.$refs.quantiteField as HTMLInputElement).focus();
    }
    this.$store.dispatch(`documentModule/saveArticles`, this.articles);
    this.$emit("calculPrix");
  }

  private isFirstItem(ligneArticle: DocumentDetail): boolean {
    return (
      this.articles.findIndex(a => a.description == ligneArticle.description) ==
      0
    );
  }

  private isLastItem(ligneArticle: DocumentDetail): boolean {
    return (
      this.articles.findIndex(a => a.description == ligneArticle.description) ==
      this.articles.length - 1
    );
  }

  private moveUp(ligneArticle: DocumentDetail) {
    const oldIndex = this.articles.findIndex(
      a => a.description == ligneArticle.description
    );
    if (oldIndex <= 0) return;
    const newIndex = oldIndex - 1;
    const rowSelected = this.articles.splice(oldIndex, 1)[0];
    this.articles.splice(newIndex, 0, rowSelected);
  }

  private moveDown(ligneArticle: DocumentDetail) {
    const oldIndex = this.articles.findIndex(
      a => a.description == ligneArticle.description
    );
    if (oldIndex >= this.articles.length - 1) return;
    const newIndex = oldIndex + 1;
    const rowSelected = this.articles.splice(oldIndex, 1)[0];
    this.articles.splice(newIndex, 0, rowSelected);
  }

  private numberToEuro(number: number, typeArticle: string) {
    if (typeArticle == "Texte") return "";
    else
      return (
        Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2 }).format(
          number
        ) + " €"
      );
  }

  private numberToString(number: number, typeArticle: string) {
    if (typeArticle == "Texte") return "";
    else
      return Intl.NumberFormat("fr-FR", { minimumFractionDigits: 0 }).format(
        number
      );
  }
}
</script>
