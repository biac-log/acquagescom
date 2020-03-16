<template>
  <v-container class="width-table mt-n3">
    <v-container class="mt-n5 mb-n5" fluid>
      <v-row dense>
        <v-col cols="12" lg="5">
          <v-card dense flat>
            <v-card-title :class="colorCustomerFound">
              <span class="mb-3">Client N°</span>
              <v-text-field
                class="ml-2 mb-n5 min-width"
                label="Numéro client"
                placeholder="Numéro client"
                v-model="numeroClient"
                :append-icon="'mdi-magnify'"
                @click:append="searchClientDialog = true"
                :color="colorNumCli"
                :error-messages="customerNotFound"
                solo
                counter="9"
                maxlength="9"
                @keyup="triggerCheck"
                :loading="loading"
              ></v-text-field>
            </v-card-title>
            <v-container>
              <v-row dense>
                <v-col cols="12" lg="6">
                  <v-text-field
                    class="min-height"
                    label="Libellé client"
                    placeholder="Libellé client"
                    v-model="libelleClient"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    class="min-height"
                    label="Adresse"
                    placeholder="Rue, numéro"
                    v-model="adrLigne1"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    class="min-height"
                    label="Téléphone"
                    placeholder="Téléphone"
                    v-model="telephone"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    class="min-height"
                    label="Complément adresse"
                    placeholder="Complément adresse"
                    v-model="adrLigne2"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    class="min-height"
                    :rules="emailRules"
                    label="E-mail"
                    placeholder="E-mail"
                    v-model="email"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    class="min-height"
                    :rules="cpLocaliteRules"
                    label="Code postal et localité"
                    placeholder="Ex: L-1234 Luxembourg"
                    v-model="cpLocalite"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>

        <v-spacer></v-spacer>

        <v-col cols="12" lg="5">
          <v-card dense flat>
            <v-card-title :class="colorDateOk">
              <v-row>
                <span class="ml-2 mt-2">Date</span>
                <DatePickerPerso
                  :styleDate="styleDate"
                  :isSolo="true"
                  :dateFromPicker.sync="dateCreation"
                  :colorDate.sync="colorDateOk"
                />
              </v-row>
            </v-card-title>
            <v-container>
              <v-row dense>
                <v-col cols="12" lg="6">
                  <v-text-field
                    class="min-height"
                    label="Créé par"
                    placeholder="Nom employé"
                    v-model="creePar"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    class="min-height"
                    label="Demandé par"
                    placeholder="Si demandeur différent du client"
                    v-model="demandePar"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="12" class="mt-n3">
                  <v-textarea
                    rows="2"
                    no-resize
                    label="Commentaire"
                    placeholder="Commentaire"
                    v-model="commentaire"
                  ></v-textarea>
                </v-col>
                <v-col v-if="this.$route.name == 'Bon de livraison'" cols="12" lg="6">
                  <DatePickerPerso
                    :dateFromPicker.sync="dateCommande"
                    :styleDate="styleDateCommande"
                    :label="dateCommandeLabel"
                  />
                </v-col>
                <v-col v-if="this.$route.name == 'Bon de livraison'" cols="12" lg="6">
                  <DatePickerPerso
                    :dateFromPicker.sync="dateLivraison"
                    :styleDate="styleDateCommande"
                    :label="dateLivraisonLabel"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-layout justify-center>
      <v-dialog
        v-model="searchClientDialog"
        eager
        hide-overlay
        max-width="800"
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar dark dense color="primary">
            <v-btn icon dark @click="searchClientDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Recherche clients</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="refreshCustomersList()">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-toolbar>
          <SearchCustomers @elementClick="editCustomerFromSearch" />
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, PropSync } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { Compte } from "@/datas/Compte";
import SearchCustomers from "@/components/SearchCustomers.vue";
import DatePickerPerso from "@/components/DatePickerPerso.vue";
import { getters } from "../store/Document/getters";
import { DocumentGesCom } from "../datas/DocumentGesCom";
const COLOR_OK = "green lighten-1 white--text";
const COLOR_NOT_OK = "orange lighten-3";

@Component({ components: { SearchCustomers, DatePickerPerso } })
export default class ZoneEdition extends Vue {
  @Getter("clientModule/getClient")
  private client!: Compte;
  @Getter("documentModule/getDocument")
  private documentCharge!: DocumentGesCom;
  @Getter("clientModule/loading")
  private loading!: boolean;
  @Getter("messagesModule/getClientNotFound")
  private customerNotFound!: string;
  @Getter("clientModule/getEmail")
  private stateEmail!: string;

  @PropSync("isSaveValid")
  private activeSave!: boolean;

  private styleDateCommande = "mt-n6";
  private styleDate = "ml-2 mb-n5 mr-3 float-right min-width";
  private dateCommandeLabel = "Date de commande";
  private dateLivraisonLabel = "Date de livraison";
  private searchClientDialog = false;
  private colorNumCli = "primary";
  private colorCustomerFound = COLOR_NOT_OK;
  private colorDateOk = COLOR_NOT_OK;

  private numeroClient = "";
  private libelleClient = "";
  private adrLigne1 = "";
  private adrLigne2 = "";
  private telephone = "";
  private email = "";
  private cpLocalite = "";

  private creePar = "";
  private dateCreation = "";
  private dateCommande = "";
  private dateLivraison = "";
  private demandePar = "";
  private commentaire = "";

  public mounted() {
    if (this.documentCharge) {
      this.setClient(this.documentCharge);
      this.displayDocument(this.documentCharge);
      this.colorCustomerFound = COLOR_OK;
      this.$store.commit("messagesModule/setMessageClientNotFound", "");
    } else this.colorCustomerFound = COLOR_NOT_OK;
  }

  @Watch("client")
  private onClientChanged(newValue: Compte, oldValue: Compte) {
    if (newValue != oldValue) {
      if (newValue == undefined) this.cleanDisplayClient();
      else this.displayClient(newValue);
    }
  }

  @Watch("stateEmail")
  private onEmailChanged(newValue: string, oldValue: string) {
    if (newValue != oldValue) {
      this.email = newValue;
    }
  }

  private emailRules = [
    (e: any) => this.isEmailValid(e) || "L'adresse mail n'est pas valide"
  ];

  private cpLocaliteRules = [
    (e: any) =>
      this.isCpLocaliteValid(e) ||
      "Le format n'est pas valide (ex: L-1234 Localité)"
  ];

  private isEmailValid(mail: string): boolean {
    if (mail == null || mail == "") {
      this.activeSave = true;
      return true;
    }
    const regexp = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    const retour = regexp.test(mail);
    this.activeSave = retour;
    return retour;
  }

  private isCpLocaliteValid(texte: string): boolean {
    if (texte == null || texte == "") {
      this.activeSave = true;
      return true;
    }
    const regexp = new RegExp(/[a-zA-Z]{1,2}-\d{4,5} +\w/);

    const retour = regexp.test(texte);
    this.activeSave = retour;
    return retour;
  }

  private triggerCheck() {
    if (this.numeroClient.length == 9) this.searchClient();
    else this.clearClient();
  }

  private clearClient() {
    this.$store.commit("clientModule/clearClient");
    this.$store.commit("clientModule/clearEmail");
    this.colorNumCli = "primary";
    const errorMessage =
      this.numeroClient.length === 0
        ? "Veuillez entrer un numéro de client"
        : "Numéro de client invalide";
    this.$store.commit("messagesModule/setMessageClientNotFound", errorMessage);
  }

  private searchClient() {
    this.$store.dispatch("clientModule/searchCustomer", this.numeroClient);
  }

  private cleanDisplayClient() {
    this.telephone = "";
    this.libelleClient = "";
    this.adrLigne1 = "";
    this.adrLigne2 = "";
    this.email = "";
    this.cpLocalite = "";
    this.colorNumCli = "red";
    this.colorCustomerFound = COLOR_NOT_OK;
  }

  private editCustomerFromSearch(client: Compte) {
    this.$store.commit("clientModule/setClient", client);
    this.searchClientDialog = false;
    this.colorNumCli = "primary";
  }

  private refreshCustomersList() {
    this.$store.dispatch("clientModule/refreshCustomersList");
  }

  private setClient(doc: DocumentGesCom) {
    const client = {
      numero: doc.numeroClient,
      telephone: doc.telephone,
      nom: doc.libelleClient,
      adrLigne1: doc.adresseLigne1,
      adrLigne2: doc.adresseLigne2,
      codePays: doc.codePays,
      codePostal: doc.codePostal,
      localite: doc.localite
    };

    this.$store.commit("clientModule/setClient", client);
  }

  private displayClient(client: Compte) {
    this.numeroClient = client.numero.toString();
    this.telephone = client.telephone;
    this.libelleClient = client.nom;
    this.adrLigne1 = client.adrLigne1;
    this.adrLigne2 = client.adrLigne2;
    this.cpLocalite = this.getCpLocalite(
      client.codePays,
      client.codePostal,
      client.localite
    );
  }

  private displayDocument(doc: DocumentGesCom) {
    this.creePar = doc.createur;
    if (doc.date)
      this.dateCreation =
        this.formatDate(new Date(doc.date).toISOString().substr(0, 10)) || "";
    if (doc.dateCommande)
      this.dateCommande =
        this.formatDate(
          new Date(doc.dateCommande).toISOString().substr(0, 10)
        ) || "";
    if (doc.dateLivraison)
      this.dateLivraison =
        this.formatDate(
          new Date(doc.dateLivraison).toISOString().substr(0, 10)
        ) || "";
    this.demandePar = doc.demandePar;
    this.commentaire = doc.commentaire;

    this.$store.commit("messagesModule/setMessageClientNotFound", "");
    this.colorNumCli = "primary";
    this.colorCustomerFound = COLOR_OK;

    this.$store.commit("documentModule/setArticles", doc.articles);
  }

  private getCpLocalite(
    codePays: string,
    codePostal: string,
    localite: string
  ): string {
    return `${codePays}-${codePostal} ${localite}`;
  }

  public getModelDoc(): DocumentGesCom {
    let doc = new DocumentGesCom();
    doc.libelleClient = this.libelleClient;
    doc.numeroClient = Number(this.numeroClient);
    doc.adresseLigne1 = this.adrLigne1;
    doc.adresseLigne2 = this.adrLigne2;
    doc.telephone = this.telephone;
    doc.email = this.email;
    const cpLocaliteSplit = this.splitCpLocalite(this.cpLocalite);
    if (cpLocaliteSplit.length == 3) {
      doc.codePays = cpLocaliteSplit[0];
      doc.codePostal = cpLocaliteSplit[1];
      doc.localite = cpLocaliteSplit[2];
    } else {
      doc.codePays = this.client?.codePays;
      doc.codePostal = this.client?.codePostal;
      doc.localite = this.client?.localite;
    }

    doc.date = this.getDate(this.dateCreation);
    if (this.dateCommande != "")
      doc.dateCommande = this.getDate(this.dateCommande);
    if (this.dateLivraison != "")
      doc.dateLivraison = this.getDate(this.dateLivraison);

    doc.createur = this.creePar;
    doc.demandePar = this.demandePar;
    doc.commentaire = this.commentaire;

    return doc;
  }

  private splitCpLocalite(cpLocalite: string): string[] {
    let retour: string[] = [];
    const cpLocaliteSplit = cpLocalite.split("-");
    if (cpLocaliteSplit.length == 2) {
      retour.push(cpLocaliteSplit[0]);
      const subSplitCpLocalite = cpLocaliteSplit[1].split(" ");
      if (subSplitCpLocalite.length >= 2) retour.push(subSplitCpLocalite[0]);
      subSplitCpLocalite.splice(0, 1);
      retour.push(subSplitCpLocalite.join(" "));
    }
    return retour;
  }

  private formatDate(date: string) {
    if (!date) return null;

    const [year, month, day] = date.split("-");
    if (Number(year) <= 1) return "";
    return `${day}/${month}/${year}`;
  }
  private getDate(date: string): Date {
    if (!date) return new Date();
    const [day, month, year] = date.split("/");
    const result = new Date(+year, +month - 1, +day, 12, 0);
    return result;
  }
}
</script>
