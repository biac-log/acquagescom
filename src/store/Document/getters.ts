import { GetterTree } from 'vuex';
import { DocumentState } from './types';
import { RootState } from '../types';
import { Compte } from '@/datas/Compte';
import { Article } from '@/datas/Article';

export const getters: GetterTree<DocumentState, RootState> = {
    getIsNewDoc(state) {
        return state.isNewDoc;
    },
    getDocument(state) {
        if (state.document)
            return state.document;
        return new Document();
    },
    getRefDoc(state) {
        return state.refDevis;
    },
    getNumeroClient(state) {
        return state.numeroClient;
    },
    getClient(state) {
        return state.client;
    },
    errorMessage(state): string {
        return state.errorMessage;
    },
    getCustomers(state): Compte[]{
        return state.customers;
    },
    getArticles(state): Article[]{
        return state.articles;
    }
};
