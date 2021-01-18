import Vue from 'vue';
import VueThree from '../src/plugins/vueThree';

Vue.use(VueThree);

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}