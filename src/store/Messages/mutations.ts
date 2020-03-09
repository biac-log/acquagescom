import { MutationTree } from 'vuex';
import { MessagesState } from './types';

export const mutations: MutationTree<MessagesState> = {
    setMessageClientNotFound(state, message: string) {
        state.messageClientNotFound = message;
    },
    setSuccessMessage(state, message: string) {
        state.displaySuccessMessage = message !== '';
        state.successMessage = message;
    },
    displaySuccessMessage(state, value: boolean) {
        state.displaySuccessMessage = value;
    },
    setErrorMessage(state, message: string) {
        state.displayErrorMessage = message !== '';
        state.errorMessage = message;
    },
    displayErrorMessage(state, value: boolean) {
        state.displayErrorMessage = value;
    },
};
