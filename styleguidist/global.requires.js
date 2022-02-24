import Vue from 'vue';
import MagpieVue from '../src/index';
import VueKonva from 'vue-konva';

Vue.use(VueKonva, { prefix: 'Canvas' });

Vue.use(MagpieVue, {
  experimentId: '9',
  serverUrl: 'https://magpie-refactored-2.herokuapp.com/',
  socketUrl: 'wss://magpie-refactored-2.herokuapp.com/socket',
  contactEmail: 'test@random.com'
});

window.MAGPIE_STYLEGUIDIST = true
