import Vue from 'vue';
import VueMagpie from 'magpie-base';
import App from './App.vue';
import magpieConfig from './magpie.config.js';

Vue.config.productionTip = false;
Vue.use(VueMagpie, magpieConfig);

new Vue({
  render: (h) => h(App)
}).$mount('#app');
