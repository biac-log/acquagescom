<template>
  <v-container>
    <ZoneEdition :createur.sync="createBy" :createDate.sync="date" :askBy.sync="demandePar"></ZoneEdition>
    <GrilleArticles
      :totalHtva.sync="prixTotalHtva"
      :totalTvac.sync="prixTotalTTC"
      :TvaTot.sync="totalTva"
      @calculPrix="calculPrix"
    ></GrilleArticles>
    <v-row>
      <v-spacer></v-spacer>
      <v-btn color="green lighten-1" @click="save" class="mb-5 white--text" :disabled="isSaveActive()">Sauvegarder</v-btn>
      <v-spacer></v-spacer>
    </v-row>
    <v-footer color="white" absolute class="overline">
      <v-spacer></v-spacer>
      {{$route.params.guid}}
    </v-footer>
  </v-container>
</template>

<script lang="ts">
/* eslint-disable */
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import ZoneEdition from "./ZoneEdition.vue";
import GrilleArticles from "./GrilleArticles.vue";
import { Getter } from "vuex-class";
import { DocumentDetail } from "@/datas/DocumentDetail";
import { Devis } from "@/datas/Devis";
import { Compte } from "@/datas/Compte";
import { documentModule } from "../store/Document";
import axios from "axios";
const TVA = 17;

@Component({ components: { ZoneEdition, GrilleArticles } })
export default class EditionDevis extends Vue {
  public createBy = "";
  public date = this.formatDate(new Date().toISOString().substr(0, 10));
  public demandePar = "";
  public prixTotalTTC = 0;
  public prixTotalHtva = 0;
  public totalTva = 0;

  @Getter(`documentModule/getArticles`)
  private articles!: DocumentDetail[];
  @Getter("documentModule/getClient")
  private client!: Compte;
  @Getter("documentModule/getEmail")
  private email!: string;

  private formatDate(date: string) {
    if (!date) return null;

    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  }

  private getDate(date: string): Date {
    if (!date) return new Date();
    const [day, month, year] = date.split("/");
    const result = new Date(+year, +month - 1, +day, 12, 0);
    return result;
  }

  private calculPrix() {
    if (!this.articles) return;
    this.prixTotalHtva = 0;
    this.prixTotalTTC = 0;
    this.totalTva = 0;
    this.articles.forEach(e => {
      this.prixTotalHtva += e.prixTotal;
      this.totalTva += e.prixTotal * (TVA / 100);
      this.prixTotalTTC += e.prixTotal + (e.prixTotal * TVA) / 100;
    });
  }

  private isSaveActive(): boolean {
    return (
      this.client == null ||
      this.client == undefined ||
      this.articles == null ||
      this.articles == undefined ||
      this.articles.length < 1
    );
  }

  private save() {
    const devis = this.getModel();
    this.sendDevis(devis);
    this.$store.commit("documentModule/setDocument", devis);
  }

  private getModel(): Devis {
    let devis = new Devis();

    devis.Date = this.getDate(this.date || "");
    devis.Createur = this.createBy;
    devis.NumeroClient = +this.client?.numero || 0;
    devis.LibelleClient = this.client?.nom;
    devis.AdresseLigne1 = this.client?.adrLigne1;
    devis.AdresseLigne2 = this.client?.adrLigne2;
    devis.CodePays = this.client?.codePays;
    devis.CodePostal = this.client?.codePostal;
    devis.Localite = this.client?.localite;
    devis.Telephone = this.client?.telephone;
    devis.Email = this.email[0];
    this.setArticlesWithNumLine();
    devis.Articles = this.articles;
    devis.PrixTotalHtva = this.prixTotalHtva;
    devis.TotalTva = this.totalTva;
    devis.PrixTotalTtc = this.prixTotalTTC;
    devis.DemandePar = this.demandePar;
    devis.AcQuaDocsId = this.$route.params.guid;

    return devis;
  }
  private setArticlesWithNumLine() {
    if (!this.articles) return;
    var i = 1;
    this.articles.forEach(a => {
      a.numeroLigne = i;
      i++;
    });
  }

  private sendDevis(devis: Devis) {
    axios
      .post(`${process.env.VUE_APP_ApiGesCom}/Devis`, devis)
      .then(() => {})
      .catch(e => {
        this.$store.commit(
          `documentModule/setErrorMessage`,
          `${e.message} ${process.env.VUE_APP_ApiAcQuaUrl}`
        );
      });
  }
}
</script>
