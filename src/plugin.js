import * as components from './components';

export default function (Vue, config) {
  // auto-import all components
  Vue.mixin({
    components: { ...components }, // casting Module to Object
    inject: {
      $exp: {
        from: 'experiment',
        default: () => ({})
      }
    },

    magpie: config,

    /**
     * Register all socket events
     */
    mounted() {
      if (this.$options.socket) {
        this.$exp.setUpSubscriptions(this.$options.socket);
      }
    },

    /**
     * unsubscribe when component unmounting
     */
    beforeDestroy() {
      if (this.$options.socket) {
        this.$exp.tearDownSubscriptions(this.$options.socket);
      }
    }
  });
}
