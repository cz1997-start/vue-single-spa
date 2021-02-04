import Vue from 'vue';
import Router from 'vue-router';
import App from './App.vue';
import routes from './router/index';

Vue.use(Router);

const router = new Router(routes);

import(/* webpackChunkName: 'c' */ '@utils/index.js').then((t) => {
  t.default();
});

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  render: (h) => h(App),
});
