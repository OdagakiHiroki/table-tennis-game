import { THREE, customThree } from '@/assets/js/three';

const VueThree = {
  install(Vue) {
    // eslint-disable-next-line no-param-reassign
    Vue.prototype.$THREE = THREE;
    // eslint-disable-next-line no-param-reassign
    Vue.prototype.$customThree = customThree;
  },
};

export default VueThree;
