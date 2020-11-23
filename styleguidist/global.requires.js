import Vue from 'vue';
import MagpieVue from '../src/index';

Vue.use(MagpieVue, {
  experimentId: '171',
  submissionUrl: 'https://magpie-demo.herokuapp.com/api/submit_experiment/',
  socketUrl: 'wss://magpie-demo.herokuapp.com/socket',
  contactEmail: 'test@random.com'
});
Vue.mixin({
  data() {
    // For the timer docs
    return { timer: null };
  }
});
