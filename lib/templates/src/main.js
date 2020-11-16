import Vue from 'vue';
import VueMagpie from 'magpie-base';
import store from './store/index';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.use(VueMagpie);

new Vue({
  store,
  render: (h) => h(App)
}).$mount('#app');
