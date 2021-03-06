import { Module } from 'vuex';
import { getters } from './getters';
import { mutations } from './mutations';
import { actions } from './actions';
import { RootState } from '../types';
import {MessagesState} from './types';

export const state: MessagesState = {
  errorMessage: '',
  displayErrorMessage: false,
  messageClientNotFound: '',
  successMessage: '',
  displaySuccessMessage: false,
};

const namespaced = true;

export const messagesModule: Module<MessagesState, RootState> = {
  namespaced,
  state,
  actions,
  getters,
  mutations,
};
