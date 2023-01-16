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

import { useSongStore } from "./stores/song";
import { storeToRefs } from "pinia";
import { watch } from "vue";

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
    app.use(pinia);
    app.use(router);
    app.use(VeeValidatePlugin);
    app.use(i18n);
    app.use(GlobalComponents);
    app.directive("icon", Icon); // global direactive

    const songStore = useSongStore();

    const { allSongs, needToFetch } = storeToRefs(songStore);
    const { getAllSongs } = songStore;

    // needToFetch.value = true;
    watch(allSongs.value, (newVal, oldVal) => {
      if (newVal === oldVal) {
        needToFetch.value = false;
      } else {
        needToFetch.value = true;
        getAllSongs();
        console.log("all song array change");
      }
    });
    getAllSongs();

    app.mount("#app");
  }
});
