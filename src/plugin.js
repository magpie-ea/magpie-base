import * as components from './components';

export default function (Vue, options) {
  // auto-import all components
  Vue.mixin({
    components: { ...components } // casting Module to Object
  });
  let experiment;
  Vue.prototype.__defineGetter__('$exp', () => experiment);
  Vue.prototype.__defineSetter__('$exp', (val) => (experiment = val));
}
