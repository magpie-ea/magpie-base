import * as components from './components';
import NoopObject from './NoopObject';

export default function (Vue, config) {
  // universal mock to cover up that fact that magpie object is not available from start
  // will always return itself when properties are accessed except for valueOf which returns () => '' to avoid errors
  const magpie = NoopObject();

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
