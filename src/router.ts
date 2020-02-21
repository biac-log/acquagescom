import Vue from "vue";
import Router from 'vue-router';
import home from './views/Home.vue'
import editionsDevis from './components/EditionDevis.vue';

Vue.use(Router);

export default new Router({
    mode: "history",
    routes: [
        {
            path: "/Devis/:guid",
            name: "Edition devis",
            component: editionsDevis,
            props: true,
        },
        {
            path:"*",
            name: "Accueil",
            component: home
        }
    ],
});

