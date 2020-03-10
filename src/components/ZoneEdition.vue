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
                    placeholder="Ex: L-1234 Luxembourg"
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
                <DatePickerPerso :dateFromPicker.sync="dateCreation" :colorDate.sync="colorDateOk"/>
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
import SearchCustomers from "@/components/SearchCustomers.vue";
import DatePickerPerso from "@/components/DatePickerPerso.vue";
import { getters } from "../store/Document/getters";
const COLOR_OK = "green lighten-1 white--text";
const COLOR_NOT_OK = "orange lighten-3";

@Component({ components: { SearchCustomers, DatePickerPerso } })
export default class ZoneEdition extends Vue {
  @Getter("clientModule/getClient")
  private client!: Compte;
  @Getter("clientModule/getLocalite")
  private cpLocalite!: string;
  @Getter("clientModule/getEmail")
  private email!: string;
  @Getter("clientModule/loading")
  private loading!: boolean;
  @Getter("messagesModule/getClientNotFound")
  private customerNotFound!: string;

  @PropSync("createur")
  private creePar!: string;
  @PropSync("createDate")
  private dateCreation!: string;
  @PropSync("askBy")
  private demandePar!: string;
  @PropSync("commentaire")
  private Comment!: string;

  private numeroClient = "";
  private libelleClient = "";
  private telephone = "";
  private adrLigne1 = "";
  private adrLigne2 = "";
  private searchClientDialog = false;
  private colorNumCli = "primary";
  private colorCustomerFound = COLOR_NOT_OK;
  private colorDateOk = COLOR_NOT_OK;

  public mounted() {
    if (this.client) {
      this.displayClient(this.client);
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

  private emailRules = [
    (e: any) => this.isEmailValid(e) || "L'adresse mail n'est pas valide"
  ];

  private isEmailValid(mail: string): boolean {
    if (mail == null || mail == "") return true;
    const regexp = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return regexp.test(mail);
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
    this.cpLocalite = "";
    this.colorNumCli = "red";
    this.colorCustomerFound = COLOR_NOT_OK;
  }

  private displayClient(client: Compte) {
    this.numeroClient = client.numero.toString();
    this.telephone = client.telephone;
    this.libelleClient = client.nom;
    this.adrLigne1 = client.adrLigne1;
    this.adrLigne2 = client.adrLigne2;
    this.$store.commit("messagesModule/setMessageClientNotFound", "");
    this.$store.dispatch("clientModule/getEmail", client.numero);
    this.colorNumCli = "primary";
    this.colorCustomerFound = COLOR_OK;
  }

  private editCustomerFromSearch(client: Compte) {
    this.$store.commit("clientModule/setClient", client);
    this.searchClientDialog = false;
    this.colorNumCli = "primary";
  }

  private refreshCustomersList() {
    this.$store.dispatch("clientModule/refreshCustomersList")
  }
}
</script>
