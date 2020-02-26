<template>
  <v-data-table
    :headers="headers"
    @click:row="editItem"
    :items="articles"
    :footer-props="{ 'items-per-page-options': [10, 25, 50],
                      	 'items-per-page-text': 'Articles par page'}"
  >
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
                      ref="quantiteField"
                      v-model="editedItem.quantite"
                      label="Quantite"
                      autofocus
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="8">
                    <v-text-field v-model="editedItem.description" label="Description"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="2">
                    <v-text-field v-model="editedItem.prix" label="Prix/unité"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
      <v-icon small @click.stop="deleteItem(item)">mdi-delete</v-icon>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { Article } from "@/datas/Article";
const MODULE_NAME = "documentModule";

@Component({})
export default class ZoneEdition extends Vue {

  @Getter(`${MODULE_NAME}/getArticles`)
  private articles!: Article[];

  private dialog = false;
  private editedIndex = -1;

  private headers = [
    { text: "Quantité", value: "quantite", width: 50, sortable: false },
    { text: "Description", value: "description", width: 500, sortable: false },
    { text: "Prix / unité", value: "prix", width: 50, sortable: false },
    { text: "Prix total", value: "prixTotal", width: 50, sortable: false },
    { text: "Actions", value: "action", sortable: false, width: 50 }
  ];

  private formTitle = "Nouvel article";
  private editedItem = {
    quantite: 1,
    description: "",
    prix: 0,
    prixTotal: 0,
    tauxTva: 0
  };
  private defaultItem = {
    quantite: 1,
    description: "",
    prix: 0,
    prixTotal: 0,
    tauxTva: 0
  };

  editItem(item: Article) {
    this.formTitle = "Modification article";
    this.editedIndex = this.articles.indexOf(item);
    this.editedItem = Object.assign({}, item);
    this.dialog = true;
    this.$store.dispatch(`${MODULE_NAME}/saveArticles`, this.articles);
  }

  deleteItem(item: Article) {
    const index = this.articles.indexOf(item);
    confirm("Êtes-vous sûr de vouloir supprimer cet article ?") &&
      this.articles.splice(index, 1);
      this.$store.dispatch(`${MODULE_NAME}/saveArticles`, this.articles);
  }

  close() {
    this.dialog = false;
    this.formTitle = "Nouvel article";
    setTimeout(() => {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    }, 300);
  }

  save() {
    this.editedItem.prixTotal = this.editedItem.prix * this.editedItem.quantite;
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
  }
}
</script>