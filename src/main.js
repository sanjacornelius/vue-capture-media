import Vue from 'vue';
import './assets/scss/main';
import App from './App.vue';
import router from './router';
import './components';
import BootstrapVue from 'bootstrap-vue';
import i18next from 'i18next';
import VueI18Next from '@panter/vue-i18next';
import '@fortawesome/fontawesome-free/css/all.min.css';

Vue.use(BootstrapVue);
Vue.config.productionTip = false;
// Allow strings to be wrapped in $t(...) for translating
// outside this package. This standalone app just returns
// the English string
Vue.use(VueI18Next);
i18next.init({lng: 'en'});
Vue.mixin({i18n: new VueI18Next(i18next)});

new Vue({
  router,
  components: { App },
  render: h => h(App)
}).$mount('#app');
