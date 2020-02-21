import Vue from "vue";
import Router from 'vue-router';
import editionsDevis from './components/EditionDevis.vue';

Vue.use(Router);

export default new Router({
    mode: "history",
    routes: [
        {
            path: "/Devis",
            name: "Edition devis",
            component: editionsDevis,
            props: true,
        },
    ],
});

