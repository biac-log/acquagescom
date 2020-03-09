import { MutationTree } from 'vuex';
import { DocumentState } from './types';
import { Compte } from '@/datas/Compte';
import { Devis } from '@/datas/Devis';
import { DocumentDetail } from '@/datas/DocumentDetail';
import { state } from '.';

export const mutations: MutationTree<DocumentState> = {
    setLoading(state, isLoading: boolean) {
        state.loading = isLoading;
    },
    setDocument: (state, doc: Devis) => {
        state.document = doc;
    },
    setClient: (state, client: Compte) => {
        state.client = client;
    },
    setEmail: (state, email: string) => {
        state.email = email;
        localStorage.setItem('email', email);
    },
    clearClient: (state) => {
        state.client = undefined;
    },
    setArticles(state, list: DocumentDetail[]) {
        state.articles = list;
    },
    addArticle(state, article: DocumentDetail) {
        state.articles.push(article);
    },
    saveArticles(state, articles) {
        state.articles = articles;
    },
    saveCustomers(state, clients: Compte[]) {
        state.customers = clients;
    },
    loadEmail(state) {
        state.email = localStorage.getItem('email') || "";
    },
    clearEmail(state) {
        state.email = '';
    },
    setIsNewDoc(state, value: boolean){
        state.isNewDoc = value;
    },
    setRefDoc(satte, value: string){
        state.refDoc = value;
    }
};
