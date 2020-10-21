import { ActionTree } from 'vuex';
import axios from 'axios';
import { DocumentState } from './types';
import { RootState } from '../types';
import { DocumentDetail } from '@/datas/DocumentDetail';
import { DocumentGesCom } from '@/datas/DocumentGesCom';
import router from '@/router';
import { stringifyConfiguration } from 'tslint/lib/configuration';

export const actions: ActionTree<DocumentState, RootState> = {
  updateDocument({ commit }, datas: any) {
    commit('setLoading', true);
    axios
      .put(datas.url, datas.doc)
      .then(() => {
        commit(
          "messagesModule/setSuccessMessage",
          `Le ${router.currentRoute.name} a été sauvegardé avec succès, vous pouvez fermer la fenêtre.`, { root: true }
        );
      })
      .catch(error => {
        let message = error.message;
        if (error.response) {
          if (error.response?.data?.Message)
            return error.response.data.Message;
          else if (typeof error.response.data === 'string' || error.response.data instanceof String)
            return `Erreur, ${error.response.status} ${error.response.data}`;
          else return `Erreur, ${error.response.status} ${error.response.statusText}`;
        }
        commit(`messagesModule/setErrorMessage`, message, { root: true }
        );
      }).finally(() => {
        commit('setLoading', false);
      });
  },
  createDocument({ commit }, datas: any) {
    commit('setLoading', true);
    axios
      .post(datas.url, datas.doc)
      .then(() => {
        if (router.currentRoute.name == "Facture") {
          commit(
            "messagesModule/setSuccessMessage",
            `La ${router.currentRoute.name} a été sauvegardée avec succès, vous pouvez fermer la fenêtre`, { root: true }
          );
        }
        commit(
          "messagesModule/setSuccessMessage",
          `Le ${router.currentRoute.name} a été sauvegardé avec succès, vous pouvez fermer la fenêtre`, { root: true }
        );
      })
      .catch(error => {
        let message = error.message;
        if (error.response) {
          if (error.response?.data?.Message)
            return error.response.data.Message;
          else if (typeof error.response.data === 'string' || error.response.data instanceof String)
            return `Erreur, ${error.response.status} ${error.response.data}`;
          else return `Erreur, ${error.response.status} ${error.response.statusText}`;
        }
        commit(`messagesModule/setErrorMessage`, message, { root: true }
        );
      }).finally(() => {
        commit('setLoading', false);
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
