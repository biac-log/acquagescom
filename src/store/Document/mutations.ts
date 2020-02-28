import { MutationTree } from 'vuex';
import { DocumentState } from './types';
import { Compte } from '@/datas/Compte';
import { Devis } from '@/datas/Devis';
import { DocumentDetail } from '@/datas/DocumentDetail';

export const mutations: MutationTree<DocumentState> = {
    setLoading(state, isLoading: boolean){
        state.loading = isLoading;
    },
    setDocument: (state, doc: Devis) => {
        state.document = doc;
    },
    setClient: (state, client: Compte) => {
        state.client = client;
        // localStorage.setItem('client', JSON.stringify(client));
    },
    setEmail: (state, email: string) => {
        state.email = email;
        localStorage.setItem('email', email);
    },
    clearClient: (state) => {
        state.client = undefined;
        // localStorage.removeItem('client');
    },
    setErrorMessage(state, errorMessage: string) {
        state.errorMessage = errorMessage;
    },
    setArticles(state, list: DocumentDetail[]) {
        state.articles = list;
    },
    addArticle(state, article: DocumentDetail) {
        state.articles.push(article);
    },
    saveArticles(state, articles) {
        // localStorage.setItem('articles', JSON.stringify(articles));
        state.articles = articles;
    },
    loadArticles(state) {
        state.articles = JSON.parse(localStorage.getItem('articles') || "[]");
    },
    saveCustomers(state, clients: Compte[]) {
        state.customers = clients;
        // localStorage.setItem('clients', JSON.stringify(clients));
    },
    loadCustomers(state) {
        state.customers = JSON.parse(localStorage.getItem('clients') || "[]");
    },
    loadClient(state){
        state.client = JSON.parse(localStorage.getItem('client') || '');
    },
    loadEmail(state){
        state.email = localStorage.getItem('email') || "";
    },
    clearEmail(state){
        state.email = '';
        // localStorage.removeItem('email');
    },
    setMessageClientNotFound(state, message: string){
        state.messageClientNotFound = message;
    }
};
