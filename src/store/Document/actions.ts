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
};
