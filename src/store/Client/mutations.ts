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
        if (state.client)
            state.client.email = email;
        state.email = email;
    },
    clearClient: (state) => {
        state.client = undefined;
    },
    saveCustomers(state, clients: Compte[]) {
        state.customers = clients;
    },
    clearEmail(state) {
        if (state.client)
            state.client.email = "";
        state.email = "";
    },
};
