import * as components from './components';
import Magpie from './Magpie';

export default function (Vue, config) {
  const magpie = !window.MAGPIE_STYLEGUIDIST ? new Magpie(config) : null;
  // auto-import all components
  Vue.mixin({
    components: { ...components },

    data() {
      return {
        magpie: null
      };
    }, // casting Module to Object

    computed: {
      $magpie() {
        return this.magpie || (this.$parent && this.$parent.$magpie) || magpie;
      }
    },

    magpie: config,

    /**
     * Register all socket events
     */
    mounted() {
      if (this.$options.socket) {
        if (this.$magpie.socket) {
          this.$magpie.socket.setUpSubscriptions(this.$options.socket, this);
        }
      }
    },

    /**
     * unsubscribe when component unmounting
     */
    beforeDestroy() {
      if (this.$options.socket) {
        if (this.$magpie.socket) {
          this.$magpie.socket.tearDownSubscriptions(this.$options.socket);
        }
      }
    }
  });
}
