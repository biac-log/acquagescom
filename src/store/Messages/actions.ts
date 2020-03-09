import { ActionTree } from 'vuex';
import { MessagesState } from './types';
import { RootState } from '../types';


export const actions: ActionTree<MessagesState, RootState> = {
  displaySuccessMessage(context, value: boolean) {
    context.commit('displaySuccessMessage', value);
  },
  displayErrorMessage(context, value: boolean) {
    context.commit('displayErrorMessage', value);
  }
};
