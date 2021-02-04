export default {
  routes: [
    {
      path: '',
      name: 'index',
      component: () => import(/* webpackChunkName: 'index' */ '../pages/index.vue'),
    },
    {
      path: '/home',
      name: 'index',
      component: () => import(/* webpackChunkName: 'home' */ '../pages/home.vue'),
    },
  ],
  scrollBehavior() {
    // 解决打开的新页面是页面的底部而不是顶部问题
    return { x: 0, y: 0 };
  },
};
