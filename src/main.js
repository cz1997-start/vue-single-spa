import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import store from './store/index';

import(/* webpackChunkName: 'c' */ '@utils/index.js').then((t) => {
  t.default();
});
createApp(App).use(store).use(router).mount('#app');
