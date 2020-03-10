import { ActionTree } from 'vuex';
import axios from 'axios';
import { ClientState } from './types';
import { RootState } from '../types';
import { Compte } from '@/datas/Compte';
import { JsonConvert, ValueCheckingMode } from 'json2typescript';
import { Email } from '@/datas/Email';


export const actions: ActionTree<ClientState, RootState> = {
  searchCustomer({ commit }, numeroClient) {
    commit('setLoading', true);
    axios
      .get<Compte>(
        `${process.env.VUE_APP_ApiAcQua}/Comptes/GetCompteById?typeCompte=Client&numeroCompte=${numeroClient}&typeAcces=PSQL_BTrieve`
      )
      .then(response => {
        if (response.data) {
          const jsonConvert: JsonConvert = new JsonConvert();
          jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL;
          const compte = jsonConvert.deserializeObject<Compte>(
            response.data,
            Compte
          );
          commit("setClient", compte);
          commit("messagesModule/setMessageClientNotFound", "", { root: true });
        } else {
          commit("clearClient");
          commit("clearEmail");
          commit("messagesModule/setMessageClientNotFound", "Ce client n'existe pas", { root: true });
        }
      })
      .catch(e => {
        commit(
          `messagesModule/setErrorMessage`,
          `${e.message} ${process.env.VUE_APP_ApiAcQua}`, { root: true }
        );
      })
      .finally(() => {
        commit('setLoading', false);
      });
  },
  getEmail({ commit }, numeroClient) {
    commit('clearEmail');
    axios
      .get<Email>(
        `${process.env.VUE_APP_ApiAcQua}/Email/GetEmailByCompte?typeCompte=Client&numeroCompte=${numeroClient}&isLocked=false`
      )
      .then(response => {
        if (response.data) {
          if (response.data.AdressesEmail)
            commit('setEmail', response.data.AdressesEmail[0]);
        }
      })
      .catch(e => {
        commit(
          `messagesModule/setErrorMessage`,
          `${e.message} ${process.env.VUE_APP_ApiAcQua}`, { root: true }
        );
      });
  },
  refreshCustomersList({ commit }) {
    commit("setLoading", true);
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
        commit("saveCustomers", clients);
      })
      .catch(e => {
        commit(
          "messagesModule/setErrorMessage",
          e.message + " " + process.env.VUE_APP_ApiAcQuaUrl, { root: true }
        );
      })
      .finally(() => {
        commit("setLoading", false);
      });
  },
  saveCustomers(context, clients: Compte[]) {
    context.commit('saveCustomers', clients);
  },
  loadCustomers(context) {
    context.commit('loadCustomers');
  },
  loadClient(context) {
    context.commit('loadClient');
  },
};
