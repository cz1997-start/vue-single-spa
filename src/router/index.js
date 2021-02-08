import { createRouter, createWebHashHistory } from 'vue-router';
import Index from '../pages/index.vue';

console.log(Index);
const routes = [
  {
    path: '/',
    name: 'index',
    component: Index,
  },
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: 'home' */ '../pages/home.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    // 解决打开的新页面是页面的底部而不是顶部问题
    return { x: 0, y: 0 };
  },
});

export default router;
