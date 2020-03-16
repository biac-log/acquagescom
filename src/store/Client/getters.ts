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
    getEmail(state): string {
        return state.email;
    }
};
