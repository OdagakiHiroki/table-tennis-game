import { THREE, customThree } from '@/assets/js/three';

const VueThree = {
  install(Vue) {
    /* eslint-disable no-param-reassign */
    Vue.prototype.$THREE = THREE;
    Vue.prototype.$customThree = customThree;
    /* eslint-enable */
  },
};

export default VueThree;
