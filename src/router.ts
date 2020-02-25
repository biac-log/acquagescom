import Vue from "vue";
import Router, { NavigationGuard } from 'vue-router';
import home from './views/Home.vue'
import editionsDevis from './components/EditionDevis.vue';
import store from './store';

Vue.use(Router);

const checkIfExist: NavigationGuard = (to, from, next) => {
    //si existe : remplir le state.document avec les données
    //sinon :
    store.commit('documentModule/setIsNewDoc', true);
    next();
}

export default new Router({
    mode: "history",
    routes: [
        {
            path: "/Devis/:guid",
            name: "Devis",
            component: editionsDevis,
            props: true,
            beforeEnter: checkIfExist,
        },
        {
            path: "*",
            name: "Accueil",
            component: home
        }
    ],
});

