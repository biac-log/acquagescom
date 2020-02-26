<template>
  <v-container>
    <v-alert
      :value="errorMessage != ''"
      type="warning"
      border="left"
      class="mt-n2"
      dismissible
    >{{ errorMessage }}</v-alert>
    <v-container class="mt-n5" fluid>
      <v-row dense>
        <v-col cols="12" lg="3">
          <v-card>
            <v-card-title :class="colorDateOk">
              <v-row>
                <span class="ml-2 mt-2">Date de création</span>
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
                      class="ml-2 mb-n5 float-right"
                      label="Date"
                      placeholder="MM/JJ/AAAA"
                      append-icon="mdi-calendar"
                      :value="dateCreation"
                      v-on="on"
                      :rules="dateRules"
                      solo
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    locale="fr-FR"
                    v-model="dateCreation"
                    no-title
                    @input="fromDateMenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-row>
            </v-card-title>
            <v-container>
              <v-row>
                <v-col cols="12" lg="12">
                  <v-text-field class="mt-n3 mb-n5" label="Devis créé par" placeholder="Nom employé" v-model="creePar"></v-text-field>
                </v-col>
                <v-col cols="12" lg="12">
                  <v-text-field class="mt-n3 mb-n5" label="Devis demandé par" placeholder="Si demandeur différent du client" v-model="demandePar"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
        <v-spacer></v-spacer>

        <v-col cols="12" lg="6">
          <v-card>
            <v-card-title :class="colorCustomerFound">
              <span class="mb-3">Client N°</span>
              <v-text-field
                class="ml-2 mb-n5"
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
              <v-row>
                <v-col cols="12" lg="6">
                  <v-text-field
                    class="mt-n3"
                    label="Libellé client"
                    placeholder="Libellé client"
                    v-model="libelleClient"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    class="mt-n3"
                    label="Adresse client"
                    placeholder="Rue, numéro"
                    v-model="adrLigne1"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    class="mt-n5"
                    label="Téléphone"
                    placeholder="Téléphone"
                    v-model="telephone"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field class="mt-n5" label="Complément adresse" placeholder="Complément adresse" v-model="adrLigne2"></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    class="mt-n5 mb-n5"
                    :rules="emailRules"
                    label="E-mail"
                    placeholder="E-mail"
                    v-model="email"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    class="mt-n5 mb-n5"
                    label="Code postal et localité"
                    placeholder="Ex: LU-1234 Luxembourg"
                    v-model="cpLocalite"
                    required
                  ></v-text-field>
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
/* eslint-disable */
import { Component, Vue, Prop } from "vue-property-decorator";
import { Document } from "../datas/Document";
import { Getter } from "vuex-class";
import { Compte } from "@/datas/Compte";
import { Email } from "../datas/Email";
import axios from "axios";
import { JsonConvert, ValueCheckingMode } from "json2typescript";
import SearchCustomers from "@/components/SearchCustomers.vue";
const COLOR_OK = "green lighten-3";
const COLOR_NOT_OK = "orange lighten-3";

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
  private cpLocalite = "";
  private demandePar = "";
  private creePar = "";
  private colorNumCli = "primary";
  private colorCustomerFound = COLOR_NOT_OK;
  private colorDateOk = COLOR_NOT_OK;
  private customerNotFound = "";
  private loading = false;

  @Getter("documentModule/errorMessage")
  private errorMessage!: string;

  private emailRules = [
    (e: any) => this.isEmailValid(e) || "L'adresse mail n'est pas valide"
  ];
  private dateRules = [
    (d: any) => this.isDateValid(d) || "La date n'est pas valide"
  ];

  private isDateValid(date: string): boolean {
    if (date != "") {
      if (!isNaN(Date.parse(date))) {
        this.colorDateOk = COLOR_OK;
        return true;
      } else {
        this.colorDateOk = COLOR_NOT_OK;
        return false;
      }
    } else {
      this.colorDateOk = COLOR_NOT_OK;
      return true;
    }
  }

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
          this.colorCustomerFound = COLOR_OK;
        } else {
          this.$store.commit("documentModule/clearClient");
          this.clearClient();
          this.colorNumCli = "red";
          this.customerNotFound = "Ce client n'existe pas";
          this.colorCustomerFound = COLOR_NOT_OK;
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
    this.cpLocalite = `${customer.codePays}-${customer.codePostal} ${customer.localite}`;
  }
  private clearClient() {
    this.dateCreation = "";
    this.libelleClient = "";
    this.telephone = "";
    this.email = "";
    this.adrLigne1 = "";
    this.adrLigne2 = "";
    this.cpLocalite = "";
    this.demandePar = "";
    this.creePar = "";
  }
  private isEmailValid(mail: string): boolean {
    if (mail == null || mail == "") return true;
    const regexp = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return regexp.test(mail);
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
