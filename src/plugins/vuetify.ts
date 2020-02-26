import Vue from "vue";
import Vuetify from "vuetify/lib";
import fr from 'vuetify/src/locale/fr'

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  lang: { locales: { fr }, current: 'fr' },
});
