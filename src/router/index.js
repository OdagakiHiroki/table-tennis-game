import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/components/pages/Home.vue';
import About from '@/components/pages/About.vue';
import GameTop from '@/components/pages/GameTop.vue';
import GameMain from '@/components/pages/GameMain.vue';
import GameResult from '@/components/pages/GameResult.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/game-top',
    name: 'GameTop',
    component: GameTop,
  },
  {
    path: '/game-main',
    name: 'GameMain',
    component: GameMain,
  },
  {
    path: '/game-result',
    name: 'GameResult',
    component: GameResult,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
