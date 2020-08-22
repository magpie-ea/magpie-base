import * as components from './components';

export default function (Vue, options) {
  // auto-import all components
  Vue.mixin({
    components: { ...components }, // casting Module to Object
    inject: {
      $exp: {
        from: 'experiment',
        default: () => ({})
      }
    }
  });
  Vue.directive('wait', (el, binding) => {
    setTimeout(() => binding.value(), Number(binding.arg));
  });
}
