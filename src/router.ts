import Vue from "vue";
import Router, { NavigationGuard } from 'vue-router';
import home from './views/Home.vue'
import editionsDevis from './components/EditionDevis.vue';
import axios from 'axios';
import { Devis } from './datas/Devis';
import store from './store';

Vue.use(Router);

const getDocument: NavigationGuard = (to, from, next) => {
    axios
        .get<Devis>(
            `${process.env.VUE_APP_ApiGesCom}/Devis?acQuaDocsId=${to.params.guid}`
        )
        .then(response => {
            if (response.data) {
                store.commit('documentModule/setDocument', response.data);
                store.commit('documentModule/setIsNewDoc', false);
                store.commit('documentModule/setRefDoc', response.data.numeroDevis);
                next();
            }
        })
        .catch(e => {
            if (e.response.status === 400) {

                store.commit(
                    `documentModule/setErrorMessage`,
                    `Numéro de référence AcQuaDocs vide ou incorrect`
                );
            }
            else
                store.commit(
                    `documentModule/setErrorMessage`,
                    `${e.message} ${process.env.VUE_APP_ApiAcQua}`
                );
            store.commit('documentModule/setIsNewDoc', true);
        });
}

export default new Router({
    mode: "history",
    routes: [
        {
            path: "/Devis/:guid",
            name: "Devis",
            component: editionsDevis,
            props: true,
            beforeEnter: getDocument,
        },
        {
            path: "*",
            name: "Accueil",
            component: home
        }
    ],
});

