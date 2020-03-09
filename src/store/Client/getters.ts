import { GetterTree } from 'vuex';
import { ClientState } from './types';
import { RootState } from '../types';
import { Compte } from '@/datas/Compte';

export const getters: GetterTree<ClientState, RootState> = {
    loading(state): boolean {
        return state.loading;
    },
    getClient(state) {
        return state.client;
    },
    getCustomers(state): Compte[] {
        return state.customers;
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
};
