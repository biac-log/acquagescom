import Vue from "vue";
import Router, { NavigationGuard } from 'vue-router';
import home from './views/Home.vue'
import editionsDevis from './components/EditionDevis.vue';
import axios from 'axios';
import store from './store';

Vue.use(Router);

const getDocument: NavigationGuard = (to, from, next) => {
    if (!isGuid(to.params.guid)) next('/');

    axios
        .get<any>(
            `${process.env.VUE_APP_ApiGesCom}/${to.path.split('/')[1]}?acQuaDocsId=${to.params.guid}`
        )
        .then(response => {
            if (response.data) {
                store.commit('documentModule/setDocument', response.data);
                store.commit('documentModule/setIsNewDoc', false);
                filldocRef(response.data);
            }
            next();
        })
        .catch(e => {
            if (e.response != undefined && e.response.status === 400) {
                store.commit(
                    `messagesModule/setErrorMessage`,
                    `Numéro de référence AcQuaDocs vide ou incorrect`
                );
            }
            else
                store.commit(
                    `messagesModule/setErrorMessage`,
                    `${e.message} ${process.env.VUE_APP_ApiAcQua}`
                );
            store.commit('documentModule/setIsNewDoc', true);
        });
}

function isGuid(str: string): boolean {
    if (str[0] === "{") {
        str = str.substring(1, str.length - 1);
    }
    var regexGuid = /^(\{){0,1}[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}(\}){0,1}$/gi;
    return regexGuid.test(str);
}

function filldocRef(doc: any){
    let ref = "";
    if(doc.numeroDevis) ref = doc.numeroDevis;
    if(doc.numeroBC) ref = doc.numeroBC;
    store.commit('documentModule/setRefDoc', ref);
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
            path: "/BonCommande/:guid",
            name: "Bon de commande",
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

