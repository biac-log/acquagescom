<template>
  <v-container>
    <ZoneEdition
      :createur.sync="createBy"
      :createDate.sync="date"
      :askBy.sync="demandePar"
      :commentaire.sync="Commentaire"
    ></ZoneEdition>
    <GrilleArticles
      :totalHtva.sync="prixTotalHtva"
      :totalTvac.sync="prixTotalTTC"
      :TvaTot.sync="totalTva"
      @calculPrix="calculPrix"
    ></GrilleArticles>
    <v-row>
      <v-spacer></v-spacer>
      <v-btn
        color="green lighten-1"
        @click="save"
        class="mb-5 white--text"
        :disabled="isSaveActive()"
      >Sauvegarder</v-btn>
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
  public Commentaire = "";
  public prixTotalTTC = 0;
  public prixTotalHtva = 0;
  public totalTva = 0;

  @Getter(`documentModule/getArticles`)
  private articles!: DocumentDetail[];
  @Getter("documentModule/getDocument")
  private document!: Devis;
  @Getter("documentModule/getIsNewDoc")
  private isNew!: boolean;
  @Getter("documentModule/getRefDoc")
  private refDoc!: string;

  @Getter("clientModule/getClient")
  private client!: Compte;
  @Getter("clientModule/getEmail")
  private email!: string;

  private created() {
    if (this.document) this.displayDocument(this.document);
  }

  private displayDocument(doc: Devis) {
    this.createBy = doc.createur;
    this.date = this.formatDate(new Date(doc.date).toISOString().substr(0, 10));
    this.demandePar = doc.demandePar;
    this.Commentaire = doc.commentaire;
    this.prixTotalTTC = doc.prixTotalTtc;
    this.prixTotalHtva = doc.prixTotalHtva;
    this.totalTva = doc.totalTva;
    this.$store.commit("clientModule/setEmail", doc.email);
    this.setPrixTotal(doc.articles);
    this.$store.commit("documentModule/setArticles", doc.articles);
    this.$store.commit("clientModule/setClient", this.createClient(doc));
  }
  setPrixTotal(articles: DocumentDetail[]) {
    articles.forEach(a => {
      a.prixTotal = a.prixUnitaire * a.quantite;
    });
  }
  private createClient(doc: Devis): Compte {
    return {
      nom: doc.libelleClient,
      numero: doc.numeroClient,
      telephone: doc.telephone,
      adrLigne1: doc.adresseLigne1,
      adrLigne2: doc.adresseLigne2,
      codePostal: doc.codePostal,
      localite: doc.localite,
      codePays: doc.codePays
    };
  }
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

    devis.date = this.getDate(this.date || "");
    devis.createur = this.createBy;
    devis.numeroClient = +this.client?.numero || 0;
    devis.libelleClient = this.client?.nom;
    devis.adresseLigne1 = this.client?.adrLigne1;
    devis.adresseLigne2 = this.client?.adrLigne2;
    devis.codePays = this.client?.codePays;
    devis.codePostal = this.client?.codePostal;
    devis.localite = this.client?.localite;
    devis.telephone = this.client?.telephone;
    devis.email = this.email;
    this.setArticlesWithNumLine();
    devis.articles = this.articles;
    devis.prixTotalHtva = this.prixTotalHtva;
    devis.totalTva = this.totalTva;
    devis.prixTotalTtc = this.prixTotalTTC;
    devis.commentaire = this.Commentaire;
    devis.demandePar = this.demandePar;
    devis.acQuaDocsId = this.$route.params.guid;
    devis.numeroDevis = this.refDoc;

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
    if (!this.isNew){
      const url = `${process.env.VUE_APP_ApiGesCom}/${this.$route.path.split('/')[1]}`;
      axios
        .put(url, devis)
        .then(() => {
          this.$store.commit(
            "messagesModule/setSuccessMessage",
            "Le devis a été sauvegardé avec succès, vous pouvez fermer la fenêtre."
          );
        })
        .catch(e => {
          this.$store.commit(
            `messagesModule/setErrorMessage`,
            `${e.message} ${process.env.VUE_APP_ApiGesCom}`
          );
        });
    }
    else
      axios
        .post(`${process.env.VUE_APP_ApiGesCom}/Devis`, devis)
        .then(() => {
          this.$store.commit(
            "messagesModule/setSuccessMessage",
            "Le devis a été sauvegardé avec succès, vous pouvez fermer la fenêtre."
          );
        })
        .catch(e => {
          this.$store.commit(
            `messagesModule/setErrorMessage`,
            `${e.message} ${process.env.VUE_APP_ApiGesCom}`
          );
        });
  }
}
</script>
