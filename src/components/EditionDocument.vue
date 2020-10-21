<template>
  <v-container>
    <ZoneEdition :isSaveValid.sync="saveValid" ref="zoneEditionVue"></ZoneEdition>
    <GrilleArticles
      :totalHtva.sync="prixTotalHtva"
      :totalTvac.sync="prixTotalTTC"
      :TvaTot.sync="totalTva"
      @calculPrix="calculPrix"
    ></GrilleArticles>
    <v-row>
      <v-spacer></v-spacer>
      <v-btn
        :loading="loading"
        color="green lighten-1"
        @click="save"
        class="mb-5 white--text"
        :disabled="isSaveActive()"
      >Sauvegarder</v-btn>
      <v-spacer></v-spacer>
    </v-row>
    <v-footer color="white" absolute class="overline">
      <v-spacer></v-spacer>
      {{guidDoc}}
    </v-footer>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import ZoneEdition from "./ZoneEdition.vue";
import GrilleArticles from "./GrilleArticles.vue";
import { Getter } from "vuex-class";
import { DocumentDetail } from "@/datas/DocumentDetail";
import { DocumentGesCom } from "@/datas/DocumentGesCom";
import { Compte } from "@/datas/Compte";
import { documentModule } from "../store/Document";

import axios from "axios";
const TVA = 17;

@Component({ components: { ZoneEdition, GrilleArticles } })
export default class EditionDocument extends Vue {
  public prixTotalTTC = 0;
  public prixTotalHtva = 0;
  public totalTva = 0;
  public saveValid = true;

  @Getter("documentModule/loading")
  private loading!: boolean;
  @Getter(`documentModule/getGuidDoc`)
  private guidDoc!: string;
  @Getter(`documentModule/getArticles`)
  private articles!: DocumentDetail[];
  @Getter("documentModule/getDocument")
  private document!: DocumentGesCom;
  @Getter("documentModule/getIsNewDoc")
  private isNew!: boolean;
  @Getter("documentModule/getRefDoc")
  private refDoc!: string;
  @Getter("clientModule/getClient")
  private client!: Compte;

  setPrixTotal(articles: DocumentDetail[]) {
    articles.forEach(a => {
      a.prixTotal = a.prixUnitaire * a.quantite;
    });
  }

  private calculPrix() {
    if (!this.articles) return;
    this.prixTotalHtva = 0;
    this.prixTotalTTC = 0;
    this.totalTva = 0;
    this.articles.forEach(e => {
      if (e.typeDetail == "Article") {
        this.prixTotalHtva += e.prixTotal;
        this.totalTva += e.prixTotal * (e.tauxTva / 100);
        this.prixTotalTTC += e.prixTotal + (e.prixTotal * e.tauxTva) / 100;
      }
    });
  }

  private isSaveActive(): boolean {
    return (
      this.client == null ||
      this.client == undefined ||
      this.articles == null ||
      this.articles == undefined ||
      this.articles.length < 1 ||
      !this.saveValid
    );
  }

  private save() {
    this.sendDocument(this.getModel());
  }

  private getModel(): DocumentGesCom {
    this.setArticlesWithNumLine();
    let doc = (this.$refs.zoneEditionVue as ZoneEdition).getModelDoc();
    doc.articles = this.articles;
    doc.prixTotalHtva = this.prixTotalHtva;
    doc.totalTva = this.totalTva;
    doc.prixTotalTtc = this.prixTotalTTC;
    doc.acQuaDocsId = this.$store.getters["documentModule/getGuidDoc"];
    if (this.$route.name == "Devis") doc.numeroDevis = this.refDoc;
    else if (this.$route.name == "Bon de commande") doc.numeroBC = this.refDoc;
    else if (this.$route.name == "Bon de livraison") doc.numeroBL = this.refDoc;
    else if (this.$route.name == "Facture") doc.numeroFacture = this.refDoc;

    return doc;
  }

  private setArticlesWithNumLine() {
    if (!this.articles) return;
    var i = 1;
    this.articles.forEach(a => {
      a.numeroLigne = i;
      i++;
    });
  }

  private sendDocument(document: DocumentGesCom) {
    if (!this.isNew) {
      this.$store.dispatch("documentModule/updateDocument", {
        url: `${process.env.VUE_APP_ApiGesCom}/${
          this.$route.path.split("/")[1]
        }`,
        doc: document
      });
    } else {
      this.$store.dispatch("documentModule/createDocument", {
        url: `${process.env.VUE_APP_ApiGesCom}/${
          this.$route.path.split("/")[1]
        }/Create`,
        doc: document
      });
    }
  }
}
</script>
