import { MutationTree } from 'vuex';
import { DocumentState } from './types';
import { Compte } from '@/datas/Compte';
import { DocumentGesCom } from '@/datas/DocumentGesCom';
import { DocumentDetail } from '@/datas/DocumentDetail';
import { state } from '.';

export const mutations: MutationTree<DocumentState> = {
    setLoading(state, isLoading: boolean) {
        state.loading = isLoading;
    },
    setInitialLoading(state, isInitialLoading: boolean) {
        state.initialLoading = isInitialLoading;
    },
    setDocument: (state, doc: DocumentGesCom) => {
        state.document = doc;
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
    setIsNewDoc(state, value: boolean){
        state.isNewDoc = value;
    },
    setRefDoc(state, value: string){
        state.refDoc = value;
    },
    setGuidDoc(state, value: string){
        state.guidDoc = value;
    }
};
