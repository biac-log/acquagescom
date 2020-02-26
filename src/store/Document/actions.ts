import { ActionTree } from 'vuex';
import axios from 'axios';
import { DocumentState } from './types';
import { RootState } from '../types';
import { Compte } from '@/datas/Compte';
import { JsonConvert, ValueCheckingMode } from 'json2typescript';
import { Article } from '@/datas/Article';


export const actions: ActionTree<DocumentState, RootState> = {
  searchCustomer({ commit, rootState, rootGetters }) {
    const numero = `${rootGetters['documentModule/getNumeroClient']}`;
    axios.get<Compte>(`${process.env.VUE_APP_ApiAcQua}/Comptes/GetCompteById?typeCompte=Client&numeroCompte=${numero}&typeAcces=PSQL_BTrieve`)
      .then((response) => {
        if (response.data) {

          const jsonConvert: JsonConvert = new JsonConvert();
          jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL;
          const compte = jsonConvert.deserialize<Compte>(response.data, Compte);
          commit('setClient', compte);
          commit('articles/setErrorMessage', "");
        }
        else
          commit('clearClient');
      })
      .catch((e) => {
        commit('articles/setErrorMessage', e.message + ' ' + process.env.VUE_APP_ApiAcQuaUrl, { root: true });
      });
  },
  addArticle(context, article: Article){
    context.commit('addArticle', article);
  }
};
