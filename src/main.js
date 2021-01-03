import Vue from 'vue';
import VueThree from '@/plugins/vueThree';
import VueCannon from '@/plugins/vueCannon';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

Vue.config.productionTip = false;
Vue.use(VueThree);
Vue.use(VueCannon);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
