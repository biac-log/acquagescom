import { Module } from 'vuex';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
import { DocumentState } from './types';
import { RootState } from '../types';

export const state: DocumentState = {
  document: undefined,
  articles: [],
  loading: false,
  initialLoading: false,
  isNewDoc: true,
  refDoc:'',
  guidDoc: '',
};

const namespaced = true;

export const documentModule: Module<DocumentState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
