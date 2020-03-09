import { ActionTree } from 'vuex';
import axios from 'axios';
import { DocumentState } from './types';
import { RootState } from '../types';
import { Compte } from '@/datas/Compte';
import { JsonConvert, ValueCheckingMode } from 'json2typescript';
import { DocumentDetail } from '@/datas/DocumentDetail';
import { Email } from '@/datas/Email';
import { Devis } from '@/datas/Devis';


export const actions: ActionTree<DocumentState, RootState> = {
  searchCustomer({ commit, rootState, rootGetters }, numeroClient) {
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
  getEmail({ commit, rootState, rootGetters }, numeroClient) {
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
  getDocument({ commit }, acQuaDocsId) {
    axios
      .get<Devis>(
        `${process.env.VUE_APP_ApiGesCom}/Devis?acQuaDocsId=${acQuaDocsId}`
      )
      .then(response => {
        if (response.data) {
          commit('setDocument', response.data);
        }
      })
      .catch(e => {
        commit(
          `messagesModule/setErrorMessage`,
          `${e.message} ${process.env.VUE_APP_ApiAcQua}`, { root: true }
        );
      });
  },
  addArticle(context, article: DocumentDetail) {
    context.commit('addArticle', article);
    context.commit('saveArticles', context.state.articles);
  },
  loadArticles(context) {
    context.commit('loadArticles');
  },
  saveArticles(context, articles: DocumentDetail[]) {
    context.commit('saveArticles', articles);
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
  reloadAllDatas(context) {
    context.commit('loadClient');
    context.commit('loadCustomers');
    context.commit('loadArticles');
    context.commit('loadEmail');
  },
};
