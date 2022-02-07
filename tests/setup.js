import Vue from 'vue';
import VueKonva from 'vue-konva';
import VueMagpie from '@/index';

Vue.config.productionTip = false;

// Load Konva components
Vue.use(VueKonva, { prefix: 'Canvas' });

// Load magpie components
Vue.use(VueMagpie, {
    experimentId: '4',
    serverUrl: typeof process.env.MAGPIE_BACKEND_HOST !== 'undefined'? 'http://'+process.env.MAGPIE_BACKEND_HOST+'/' : 'https://magpie-refactored-2.herokuapp.com/',
    socketUrl: typeof process.env.MAGPIE_BACKEND_HOST !== 'undefined'? 'ws://'+process.env.MAGPIE_BACKEND_HOST+'/socket' : 'wss://magpie-refactored-2.herokuapp.com/socket',
    contactEmail: 'test@random.com'
});

// shims

const nodeCrypto = require('crypto');
window.crypto = {
    getRandomValues: function (buffer) {
        return nodeCrypto.randomFillSync(buffer);
    }
};

global.self = window
global.WebSocket = window.WebSocket = require('websocket').w3cwebsocket

window.scrollTo = () => {}
console.log = () => {}
