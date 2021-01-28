export default {
  routes: [
    {
      path: "",
      name: "index",
      component: () => import("../pages/index.vue"),
    },
  ],
  scrollBehavior() {
    // 解决打开的新页面是页面的底部而不是顶部问题
    return { x: 0, y: 0 };
  },
};
