import { createApp, markRaw } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import VeeValidatePlugin from "./includes/validation";
import { auth } from "./includes/firebase";
import Icon from "./directives/icon";
import { i18n } from "./includes/i18n";
import { registerSW } from "virtual:pwa-register";
import GlobalComponents from "./includes/_globals";
import progressBar from "./includes/progress-bar";
import moment from "moment";

import "./assets/base.css";
import "./assets/main.css";
import "nprogress/nprogress.css";

registerSW({ immediate: true });

progressBar(router);

let app;

auth.onAuthStateChanged(() => {
  // 如果app還沒被create 就createApp
  if (!app) {
    app = createApp(App);

    const pinia = createPinia();
    pinia.use(({ store }) => {
      store.router = markRaw(router);
    });

    // moment js
    app.config.globalProperties.$filters = {
      timeAgo(date) {
        return moment(date).fromNow();
      },
    };

    app.use(pinia);
    app.use(router);
    app.use(VeeValidatePlugin);
    app.use(i18n);
    app.use(GlobalComponents);
    app.directive("icon", Icon); // global direactive

    app.mount("#app");
  }
});
