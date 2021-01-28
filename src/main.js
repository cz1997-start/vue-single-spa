import Vue from "vue";
import App from "./App.vue";
import Router from "vue-router";
import routes from "./router/index";

Vue.use(Router);

const router = new Router(routes);

new Vue({
  router,
  el: "#app",
  render: (h) => h(App),
});
