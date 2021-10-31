import Vue from 'vue';
import VueKonva from 'vue-konva';
import VueMagpie from '@/index';
import magpieConfig from '../lib/templates/src/magpie.config.js';

Vue.config.productionTip = false;

// Load Konva components
Vue.use(VueKonva, { prefix: 'Canvas' });

// Load magpie components
Vue.use(VueMagpie, magpieConfig);

const nodeCrypto = require('crypto');
window.crypto = {
    getRandomValues: function (buffer) {
        return nodeCrypto.randomFillSync(buffer);
    }
};

window.scrollTo = () => {}
