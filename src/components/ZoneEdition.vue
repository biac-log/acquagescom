<template>
  <v-container>
    <v-form>
      <v-container>
        <v-alert
          :value="errorMessage != ''"
          type="warning"
          border="left"
          class="mt-n2"
          dismissible
        >{{ errorMessage }}</v-alert>
        <v-row class="mt-n2">
          <v-col dense cols="12" lg="2" md="3">
            <v-text-field
              label="Numéro client"
              v-model="numeroClient"
              :append-icon="'mdi-magnify'"
              @click:append="searchClientDialog = true"
              :color="colorNumCli"
              :error-messages="customerNotFound"
              required
              class="mb-n3"
              counter="9"
              maxlength="9"
              @keyup="triggerCheck"
              :loading="loading"
            ></v-text-field>
          </v-col>
          <v-col class="mb-n3" cols="12" lg="3" md="3">
            <v-text-field label="Nom - Prénom" v-model="libelleClient" required></v-text-field>
          </v-col>
          <v-col class="mb-n3" cols="12" lg="2" md="3">
            <v-text-field label="Téléphone" v-model="telephone" required></v-text-field>
          </v-col>
          <v-col class="mb-n3" cols="12" lg="3" md="3">
            <v-text-field :rules="emailRules" label="E-mail" v-model="email" required></v-text-field>
          </v-col>
          <v-col class="mb-n3" cols="12" lg="2" md="3">
            <v-menu
              v-model="fromDateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  label="Date"
                  append-icon="event"
                  :value="dateCreation"
                  v-on="on"
                  :rules="dateRules"
                ></v-text-field>
              </template>
              <v-date-picker
                locale="fr-FR"
                v-model="dateCreation"
                no-title
                @input="fromDateMenu = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col class="mt-n5" cols="12" lg="3" md="3">
            <v-text-field label="Rue, numéro" v-model="adrLigne1" required></v-text-field>
          </v-col>
          <v-col class="mt-n5" cols="12" lg="3" md="3">
            <v-text-field label="Complément adresse" v-model="adrLigne2"></v-text-field>
          </v-col>
          <v-col class="mt-n5" cols="12" lg="1" md="3">
            <v-text-field label="Code postal" v-model="codePostal" :rules="cpRules" required></v-text-field>
          </v-col>
          <v-col class="mt-n5" cols="12" lg="2" md="3">
            <v-text-field label="Localité" v-model="localite" required></v-text-field>
          </v-col>
          <v-col class="mt-n5" cols="12" lg="3" md="3">
            <v-text-field label=" Devis demandé par" v-model="demandePar"></v-text-field>
          </v-col>
        </v-row>
      </v-container>
      <v-footer absolute>Guid du document : {{$route.params.guid}}</v-footer>
    </v-form>
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
/* eslint-disable */
import { Component, Vue, Prop } from "vue-property-decorator";
import { Document } from "../datas/Document";
import { Getter } from "vuex-class";
import { Compte } from "@/datas/Compte";
import { Email } from "../datas/Email";
import axios from "axios";
import { JsonConvert, ValueCheckingMode } from "json2typescript";
import SearchCustomers from "@/components/SearchCustomers.vue";

@Component({ components: { SearchCustomers } })
export default class ZoneEdition extends Vue {
  private searchClientDialog = false;
  private fromDateMenu = false;
  private dateCreation = "";
  private libelleClient = "";
  private numeroClient = "";
  private telephone = "";
  private email = "";
  private adrLigne1 = "";
  private adrLigne2 = "";
  private codePostal = "";
  private localite = "";
  private demandePar = "";
  private colorNumCli = "primary";
  private customerNotFound = "";
  private loading = false;

  @Getter("documentModule/errorMessage")
  private errorMessage!: string;

  private emailRules = [
    (e: any) => this.isEmailValid(e) || "L'adresse mail n'est pas valide"
  ];
  private dateRules = [
    (d: any) => !isNaN(Date.parse(d)) || "La date n'est pas valide"
  ];
  private cpRules = [
    (cp: any) => !isNaN(cp) || "Le code postal n'est pas valide"
  ];
  private triggerCheck() {
    if (this.numeroClient.length == 9) this.checkClient();
    else {
      this.colorNumCli = "primary";
      this.customerNotFound = "";
    }
  }
  private checkClient() {
    this.loading = true;
    axios
      .get<Compte>(
        `${process.env.VUE_APP_ApiAcQua}/Comptes/GetCompteById?typeCompte=Client&numeroCompte=${this.numeroClient}&typeAcces=PSQL_BTrieve`
      )
      .then(response => {
        if (response.data) {
          const jsonConvert: JsonConvert = new JsonConvert();
          jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL;
          const compte = jsonConvert.deserializeObject<Compte>(
            response.data,
            Compte
          );
          this.getEmail();
          this.refreshClient(compte);
          this.$store.commit("documentModule/setClient", compte);
          this.colorNumCli = "primary";
          this.customerNotFound = "";
        } else {
          this.$store.commit("documentModule/clearClient");
          this.clearClient();
          this.colorNumCli = "red";
          this.customerNotFound = "Ce client n'existe pas";
        }
      })
      .catch(e => {
        this.$store.commit(
          `documentModule/setErrorMessage`,
          `${e.message} ${process.env.VUE_APP_ApiAcQuaUrl}`
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }
  private getEmail() {
    axios
      .get<Email>(
        `${process.env.VUE_APP_ApiAcQua}/Email/GetEmailByCompte?typeCompte=Client&numeroCompte=${this.numeroClient}&isLocked=false`
      )
      .then(response => {
        if (response.data) {
          if (response.data.AdressesEmail)
            this.email = response.data.AdressesEmail;
        }
      })
      .catch(e => {
        this.$store.commit(
          `documentModule/setErrorMessage`,
          `${e.message} ${process.env.VUE_APP_ApiAcQuaUrl}`
        );
      });
  }
  private refreshClient(customer: Compte) {
    this.numeroClient = customer.numero.toString();
    this.libelleClient = customer.nom;
    this.telephone = customer.telephone;
    this.adrLigne1 = customer.adrLigne1;
    this.adrLigne2 = customer.adrLigne2;
    this.codePostal = customer.codePostal;
    this.localite = customer.localite;
  }
  private clearClient() {
    this.dateCreation = "";
    this.libelleClient = "";
    this.telephone = "";
    this.email = "";
    this.adrLigne1 = "";
    this.adrLigne2 = "";
    this.codePostal = "";
    this.localite = "";
    this.demandePar = "";
  }
  private isEmailValid(mail: string): boolean {
    if (mail == null || mail == "") return true;
    const regexp = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return regexp.test(mail);
  }
  private getModel(): Document {
    const doc = new Document();

    doc.numeroClient = this.numeroClient;
    doc.libelleClient = this.libelleClient;
    doc.telephone = this.telephone;
    doc.email = this.email;
    doc.dateCreation = new Date(this.dateCreation);
    doc.adrLigne1 = this.adrLigne1;
    doc.adrLigne2 = this.adrLigne2;
    doc.codePostal = this.codePostal;
    doc.localite = this.localite;
    doc.demandePar = this.demandePar;

    return doc;
  }

  private editCustomerFromSearch(client: Compte) {
    this.searchClientDialog = false;
    this.refreshClient(client);
    this.colorNumCli = "primary";
    this.customerNotFound = "";
  }

  private refreshCustomersList() {
    this.loading = true;
    let clients: Compte[] | null = null;
    axios;
    axios
      .post<Compte[]>(
        `${process.env.VUE_APP_ApiAcQua}/Comptes/GetComptes?compteBloquer=false&typeAcces=PSQL_BTrieve`,
        ["Client"]
      )
      .then(response => {
        const jsonConvert: JsonConvert = new JsonConvert();
        jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL;
        clients = jsonConvert.deserializeArray(response.data, Compte);
        this.$store.commit("documentModule/setCustomers", clients);
      })
      .catch(e => {
        // commit('setErrorMessage', e.message + ' ' + process.env.VUE_APP_ApiAcQuaUrl);
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
</script>
