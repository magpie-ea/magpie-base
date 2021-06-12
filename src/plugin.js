import * as components from './components';
import Magpie from './Magpie';

export default function (Vue, config) {
  const magpie = new Magpie(config);
  // auto-import all components
  Vue.mixin({
    components: { ...components }, // casting Module to Object

    computed: {
      $magpie() {
        return magpie;
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
