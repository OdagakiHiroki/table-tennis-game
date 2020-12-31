import Vue from 'vue';
import VueThree from '@/plugins/vueThree';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

Vue.config.productionTip = false;
Vue.use(VueThree);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
