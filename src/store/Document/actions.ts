import { ActionTree } from 'vuex';
import axios from 'axios';
import { DocumentState } from './types';
import { RootState } from '../types';
import { Compte } from '@/datas/Compte';
import { JsonConvert, ValueCheckingMode } from 'json2typescript';
import { DocumentDetail } from '@/datas/DocumentDetail';
import { Email } from '@/datas/Email';


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
          commit("setMessageClientNotFound", "")
        } else {
          commit("clearClient");
          commit("clearEmail");
          commit("setMessageClientNotFound", "Ce client n'existe pas");
        }
      })
      .catch(e => {
        commit(
          `setErrorMessage`,
          `${e.message} ${process.env.VUE_APP_ApiAcQuaUrl}`
        );
      })
      .finally(() => {
        commit('setLoading', false);
      });
  },
  getEmail({ commit, rootState, rootGetters }, numeroClient){
    commit('clearEmail');
    axios
      .get<Email>(
        `${process.env.VUE_APP_ApiAcQua}/Email/GetEmailByCompte?typeCompte=Client&numeroCompte=${numeroClient}&isLocked=false`
      )
      .then(response => {
        if (response.data) {
          if (response.data.AdressesEmail)
            commit('setEmail', response.data.AdressesEmail);
        }
      })
      .catch(e => {
        commit(
          `documentModule/setErrorMessage`,
          `${e.message} ${process.env.VUE_APP_ApiAcQuaUrl}`
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
  loadClient(context){
    context.commit('loadClient');
  },
  reloadAllDatas(context){
    context.commit('loadClient');
    context.commit('loadCustomers');
    context.commit('loadArticles');
    context.commit('loadEmail');
  }
};
