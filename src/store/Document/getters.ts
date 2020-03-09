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
    getNumeroClient(state) {
        return state.client?.numero || "";
    },
    getClient(state) {
        return state.client;
    },
    getCustomers(state): Compte[] {
        return state.customers;
    },
    getArticles(state): DocumentDetail[] {
        return state.articles;
    },
    getLibelle(state): string {
        return state.client?.nom || "";
    },
    getTelephone(state): string {
        return state.client?.telephone || "";
    },
    getAdrLigne1(state): string {
        return state.client?.adrLigne1 || "";
    },
    getAdrLigne2(state): string {
        return state.client?.adrLigne2 || "";
    },
    getLocalite(state): string {
        let result = "";
        if (state.client?.codePays) result += `${state.client?.codePays}-`;
        if (state.client?.codePostal) result += `${state.client?.codePostal} `;
        if (state.client?.localite) result += `${state.client?.localite}`;
        return result;
    },
    getEmail(state): string {
        return state.email;
    },
    getIsNewDoc(state):boolean{
        return state.isNewDoc;
    },
    getRefDoc(state) : string{
        return state.refDoc;
    }
};
