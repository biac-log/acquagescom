import Vue from "vue";
import Router, { NavigationGuard } from 'vue-router';
import home from './views/Home.vue'
import EditionDocument from './components/EditionDocument.vue';
import axios from 'axios';
import store from './store';

Vue.use(Router);

const getDocument: NavigationGuard = (to, from, next) => {
    if (isGuid(to.params.docId)) {
        store.commit('documentModule/setGuidDoc', to.params.docId);
        store.commit('documentModule/setIsNewDoc', true);
        next();
    }
    else {
        store.commit('documentModule/setInitialLoading', true);
        const refDoc = to.params.docId.replace("%2F", "/");
        axios
            .get<any>(
                `${process.env.VUE_APP_ApiGesCom}/${to.path.split('/')[1]}?documentId=${refDoc}`
            )
            .then(response => {
                if (response.data) {
                    store.commit('documentModule/setDocument', response.data);
                    store.commit('documentModule/setIsNewDoc', false);
                    store.commit('documentModule/setGuidDoc', response.data.acQuaDocsId);
                    filldocRef(response.data);
                    next();
                }
            })
            .catch(e => {
                if (e.response != undefined && e.response.status === 404) {
                    store.commit(
                        `messagesModule/setErrorMessage`,
                        `Numéro de ${to.name} ${refDoc} incorrect`
                    );
                    next('/');
                }
                else
                    store.commit(
                        `messagesModule/setErrorMessage`,
                        `${e.message} ${process.env.VUE_APP_ApiAcQua}`
                    );
            })
            .finally(() => {
                store.commit('documentModule/setInitialLoading', false);
            });
    }
}

function isGuid(str: string): boolean {
    if (str[0] === "{") {
        str = str.substring(1, str.length - 1);
    }
    var regexGuid = /^(\{){0,1}[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}(\}){0,1}$/gi;
    return regexGuid.test(str);
}

function filldocRef(doc: any) {
    let ref = "";
    if (doc.numeroDevis) ref = doc.numeroDevis;
    if (doc.numeroBC) ref = doc.numeroBC;
    if (doc.numeroBL) ref = doc.numeroBL;
    if(doc.numeroFacture) ref = doc.numeroFacture;
    store.commit('documentModule/setRefDoc', ref);
}

export default new Router({
    mode: "history",
    routes: [
        {
            path: "*",
            name: "Accueil",
            component: home
        },
        {
            path: "/Devis/:docId",
            name: "Devis",
            component: EditionDocument,
            props: true,
            beforeEnter: getDocument
        },
        {
            path: "/BonCommande/:docId",
            name: "Bon de commande",
            component: EditionDocument,
            props: true,
            beforeEnter: getDocument
        },
        {
            path: "/BonLivraison/:docId",
            name: "Bon de livraison",
            component: EditionDocument,
            props: true,
            beforeEnter: getDocument
        },
        {
            path: "/Facture/:docId",
            name: "Facture",
            component: EditionDocument,
            props: true,
            beforeEnter: getDocument
        }

    ],
});

