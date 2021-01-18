import { CANNON, customCannon } from '@/assets/js/cannon';

const VueCannon = {
  install(Vue) {
    /* eslint-disable no-param-reassign */
    Vue.prototype.$CANNON = CANNON;
    Vue.prototype.$customCannon = customCannon;
    /* eslint-enable */
  },
};

export default VueCannon;
