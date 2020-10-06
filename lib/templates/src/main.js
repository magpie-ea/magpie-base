import Vue from 'vue';
import VueMagpie from 'magpie-base';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.use(VueMagpie);

new Vue({
  render: (h) => h(App)
}).$mount('#app');
