import { MutationTree } from 'vuex';
import { DocumentState } from './types';
import { Compte } from '@/datas/Compte';
import { Document } from '@/datas/Document';

export const mutations: MutationTree<DocumentState> = {
    setIsNewDoc: (state, isNew: boolean) => {
        state.isNewDoc = isNew;
    },
    setDocument: (state, doc: Document) => {
        state.document = doc;
    },
    setRefDevis: (state, ref: string) => {
        state.refDevis = ref;
    },
    setNumeroClient: (state, numero: string) => {
        state.numeroClient = numero;
    },
    setClient: (state, client: Compte) => {
        state.client = client;
    },
    clearClient: (state) => {
        state.client = undefined;
    },
    setErrorMessage(state, errorMessage: string) {
        state.errorMessage = errorMessage;
    },
    setCustomers(state, list: Compte[]){
        state.customers = list;
    }
};
