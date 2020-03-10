import { ActionTree } from 'vuex';
import axios from 'axios';
import { DocumentState } from './types';
import { RootState } from '../types';
import { DocumentDetail } from '@/datas/DocumentDetail';
import { Devis } from '@/datas/Devis';
import router from '@/router';

export const actions: ActionTree<DocumentState, RootState> = {
  updateDocument({ commit }, datas: any) {
    
        axios
      .put(datas.url, datas.doc)
      .then(() => {
        commit(
          "messagesModule/setSuccessMessage",
          `Le ${router.currentRoute.name} a été sauvegardé avec succès, vous pouvez fermer la fenêtre.`, {root:true}
        );
      })
      .catch(e => {
        commit(
          `messagesModule/setErrorMessage`,
          `${e.message} ${process.env.VUE_APP_ApiGesCom}`, {root:true}
        );
      });
  },
  sendDevis({commit}, devis: Devis) {
    axios
    .post(`${process.env.VUE_APP_ApiGesCom}/Devis`, devis)
    .then(() => {
      commit(
        "messagesModule/setSuccessMessage",
        "Le devis a été sauvegardé avec succès, vous pouvez fermer la fenêtre."
      );
    })
    .catch(e => {
      commit(
        `messagesModule/setErrorMessage`,
        `${e.message} ${process.env.VUE_APP_ApiGesCom}`
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
