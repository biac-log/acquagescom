import { MutationTree } from 'vuex';
import { ClientState } from './types';
import { Compte } from '@/datas/Compte';
import { state } from '.';

export const mutations: MutationTree<ClientState> = {
    setLoading(state, isLoading: boolean) {
        state.loading = isLoading;
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
    saveCustomers(state, clients: Compte[]) {
        state.customers = clients;
    },
    loadEmail(state) {
        state.email = localStorage.getItem('email') || "";
    },
    clearEmail(state) {
        state.email = '';
    },
};
