import { GetterTree } from 'vuex';
import { DocumentState } from './types';
import { RootState } from '../types';
import { Compte } from '@/datas/Compte';
import { DocumentDetail } from '@/datas/DocumentDetail';

export const getters: GetterTree<DocumentState, RootState> = {
    loading(state): boolean {
        return state.loading;
    },
    getDocument(state) {
        return state.document;
    },
    getArticles(state): DocumentDetail[] {
        return state.articles;
    },
    getIsNewDoc(state):boolean{
        return state.isNewDoc;
    },
    getRefDoc(state) : string{
        return state.refDoc;
    }
};
