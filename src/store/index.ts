import Vue from "vue";
import Vuex from "vuex";
import { documentModule } from './Document/index';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    version: '1.0.0',
  },
  mutations: {},
  actions: {},
  modules: {
    documentModule,
  }
});
