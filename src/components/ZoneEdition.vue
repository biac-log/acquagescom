<template>
  <v-container class="width-table mt-n3">
    <v-alert
      :value="errorMessage != ''"
      type="warning"
      border="left"
      class="mt-n2"
      dismissible
    >{{ errorMessage }}</v-alert>
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
                    :value="libelleClient"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    class="min-height"
                    label="Adresse"
                    placeholder="Rue, numéro"
                    :value="adrLigne1"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    class="min-height"
                    label="Téléphone"
                    placeholder="Téléphone"
                    :value="telephone"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    class="min-height"
                    label="Complément adresse"
                    placeholder="Complément adresse"
                    :value="adrLigne2"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    class="min-height"
                    :rules="emailRules"
                    label="E-mail"
                    placeholder="E-mail"
                    :value="email"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    class="min-height"
                    label="Code postal et localité"
                    placeholder="Ex: LU-1234 Luxembourg"
                    :value="cpLocalite"
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
                <v-menu
                  v-model="fromDateMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      class="ml-2 mb-n5 mr-3 float-right min-width"
                      v-model="dateCreation"
                      label="Date"
                      placeholder="jj/mm/aaaa"
                      append-icon="mdi-calendar"
                      v-on="on"
                      :rules="dateRules"
                      solo
                      counter="10"
                      maxlength="10"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    locale="fr-fr"
                    v-model="dateFromDatePicker"
                    no-title
                    @input="fromDateMenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-row>
            </v-card-title>
            <v-container>
              <v-row dense>
                <v-col cols="12" lg="6">
                  <v-text-field
                    class="min-height"
                    label="Devis créé par"
                    placeholder="Nom employé"
                    v-model="creePar"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                    class="min-height"
                    label="Devis demandé par"
                    placeholder="Si demandeur différent du client"
                    v-model="demandePar"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="12" class="mt-n3">
                  <v-textarea
                    rows="3"
                    no-resize
                    label="Commentaire"
                    placeholder="Commentaire"
                    v-model="Comment"
                  ></v-textarea>
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
import { Email } from "../datas/Email";
import axios from "axios";
import { JsonConvert, ValueCheckingMode } from "json2typescript";
import SearchCustomers from "@/components/SearchCustomers.vue";
import { getters } from "../store/Document/getters";
const COLOR_OK = "green lighten-1 white--text";
const COLOR_NOT_OK = "orange lighten-3";

@Component({ components: { SearchCustomers } })
export default class ZoneEdition extends Vue {
  @Getter("documentModule/getLibelle")
  private libelleClient!: string;
  @Getter("documentModule/getTelephone")
  private telephone!: string;
  @Getter("documentModule/getAdrLigne1")
  private adrLigne1!: string;
  @Getter("documentModule/getAdrLigne2")
  private adrLigne2!: string;
  @Getter("documentModule/getLocalite")
  private cpLocalite!: string;
  @Getter("documentModule/getClient")
  private client!: Compte;
  @Getter("documentModule/getEmail")
  private email!: string;
  @Getter("documentModule/getClientNotFound")
  private customerNotFound!: string;

  @Getter("documentModule/errorMessage")
  private errorMessage!: string;
  @Getter("documentModule/loading")
  private loading!: boolean;

  @PropSync("createur")
  private creePar!: string;
  @PropSync("createDate")
  private dateCreation!: string;
  @PropSync("askBy")
  private demandePar!: string;
  @PropSync("commentaire")
  private Comment!: string;

  private numeroClient = this.getNumCli();
  private searchClientDialog = false;
  private fromDateMenu = false;

  private dateFromDatePicker = new Date().toISOString().substr(0, 10);
  private colorNumCli = "primary";
  private colorCustomerFound = COLOR_NOT_OK;
  private colorDateOk = COLOR_NOT_OK;

  public mounted() {
    if (this.client) this.colorCustomerFound = COLOR_OK;
    else this.colorCustomerFound = COLOR_NOT_OK;
  }

  @Watch("dateFromDatePicker")
  private ondateFromDatePickerChanged(newValue: Compte, oldValue: Compte) {
    this.dateCreation = this.formatDate(this.dateFromDatePicker) || "";
  }

  //Doit recevoir une date au format JJ/MM/AAAA après année 2000
  private verifyDate(date: string): boolean {
    if (!date) return false;

    const [dayStr, monthStr, yearStr] = date.split("/");
    const day = +dayStr;
    const month = +monthStr;
    const year = +yearStr;
    if (day <= 0 || month <= 0 || month > 12 || year < 2000) return false;

    const isBisextile = year % 100 === 0 ? year % 400 === 0 : year % 4 === 0;

    if (month == 2 && isBisextile && day > 29) return false;
    if (month == 2 && !isBisextile && day > 28) return false;

    if (
      (month == 1 ||
        month == 3 ||
        month == 5 ||
        month == 7 ||
        month == 8 ||
        month == 10 ||
        month == 12) &&
      day > 31
    )
      return false;
    if (day > 30) return false;

    return true;
  }

  private formatDate(date: string) {
    if (!date) return null;

    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  }

  private emailRules = [
    (e: any) => this.isEmailValid(e) || "L'adresse mail n'est pas valide"
  ];
  private dateRules = [
    (d: any) => this.isDateValid(d) || "La date n'est pas valide"
  ];

  private isDateValid(date: string): boolean {
    if (date != "" && date.length == 10) {
      if (this.verifyDate(date)) {
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
  private getNumCli(): string {
    return this.$store.getters["documentModule/getNumeroClient"];
  }

  private triggerCheck() {
    if (this.numeroClient.length == 9) this.searchClient();
    else {
      this.colorNumCli = "primary";
      this.$store.commit("documentModule/setMessageClientNotFound", "");
    }
  }
  private searchClient() {
    this.$store.dispatch("documentModule/searchCustomer", this.numeroClient);
  }

  @Watch("client")
  private onClientChanged(newValue: Compte, oldValue: Compte) {
    if (newValue) {
      this.numeroClient = newValue.numero.toString();
      this.$store.dispatch("documentModule/getEmail", newValue.numero);
      this.colorNumCli = "primary";
      this.colorCustomerFound = COLOR_OK;
    } else {
      this.colorNumCli = "red";
      this.colorCustomerFound = COLOR_NOT_OK;
    }
  }

  private isEmailValid(mail: string): boolean {
    if (mail == null || mail == "") return true;
    const regexp = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return regexp.test(mail);
  }

  private editCustomerFromSearch(client: Compte) {
    this.$store.commit("documentModule/setClient", client);
    this.searchClientDialog = false;
    this.colorNumCli = "primary";
  }

  private refreshCustomersList() {
    this.$store.commit("documentModule/setLoading", true);
    let clients: Compte[] | null = null;
    axios
      .post<Compte[]>(
        `${process.env.VUE_APP_ApiAcQua}/Comptes/GetComptes?compteBloquer=false&typeAcces=PSQL_BTrieve`,
        ["Client"]
      )
      .then(response => {
        const jsonConvert: JsonConvert = new JsonConvert();
        jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL;
        clients = jsonConvert.deserializeArray(response.data, Compte);
        this.$store.commit("documentModule/saveCustomers", clients);
      })
      .catch(e => {
        this.$store.commit(
          "documentModule/setErrorMessage",
          e.message + " " + process.env.VUE_APP_ApiAcQuaUrl
        );
      })
      .finally(() => {
        this.$store.commit("documentModule/setLoading", false);
      });
  }
}
</script>
