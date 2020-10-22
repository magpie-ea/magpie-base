import Vue from 'vue';
import MagpieVue from '../src/index';

Vue.use(MagpieVue);
Vue.mixin({
  data() {
    // For the timer docs
    return { timer: null };
  }
});
