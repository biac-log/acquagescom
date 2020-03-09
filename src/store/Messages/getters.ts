import { GetterTree } from 'vuex';
import { RootState } from '../types';
import { MessagesState } from './types';

export const getters: GetterTree<MessagesState, RootState> = {
    errorMessage(state): string {
        return state.errorMessage;
    },
    getClientNotFound(state): string {
        return state.messageClientNotFound;
    },
    successMessage(state): string {
        return state.successMessage;
    },
};
