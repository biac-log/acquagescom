import { Module } from 'vuex';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
import { ClientState } from './types';
import { RootState } from '../types';

export const state: ClientState = {
  client: undefined,
  customers: [],
  loading: false,
  email:'',
};

const namespaced = true;

export const clientModule: Module<ClientState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
