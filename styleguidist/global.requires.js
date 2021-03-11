import Vue from 'vue';
import MagpieVue from '../src/index';

Vue.use(MagpieVue, {
  experimentId: '171',
  serverUrl: 'https://magpie-demo.herokuapp.com/',
  socketUrl: 'wss://magpie-demo.herokuapp.com/socket',
  contactEmail: 'test@random.com'
});
