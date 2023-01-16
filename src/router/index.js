import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import { usePlayerStore } from "../stores/player";
import { storeToRefs } from "pinia";
import { useWindowSize } from "@vueuse/core";
// import { useSongStore } from "../stores/song";
// import { watch } from "vue";

const HomeView = () => import("@/views/HomeView.vue");
const ManageView = () => import("@/views/ManageView.vue");
const SongView = () => import("@/views/SongView.vue");
const AboutView = () => import("@/views/AboutView.vue");
const ManageUserInfo = () => import("@/views/UserInfoView.vue");

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/user-info",
    name: "UserInfo",
    component: ManageUserInfo,
    meta: {
      requireMobile: true,
    },
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
  },
  {
    path: "/manage-music",
    // alias: "/manage", // rediect 的另一種選擇，不過為了seo 還是推薦使用redirect
    name: "manage",
    component: ManageView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/manage",
    redirect: { name: "manage" },
  },
  {
    path: "/song/:id",
    name: "song",
    component: SongView,
  },
  {
    path: "/:catchAll(.*)*",
    redirect: { name: "home" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: "text-yellow-500",
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  // const songStore = useSongStore();

  // const { allSongs, needToFetch } = storeToRefs(songStore);
  // const { getAllSongs } = songStore;

  // // needToFetch.value = true;
  // watch(allSongs.value, (newVal, oldVal) => {
  //   if (newVal === oldVal) {
  //     needToFetch.value = false;
  //   } else {
  //     needToFetch.value = true;
  //     getAllSongs();
  //     console.log("all song array change");
  //   }
  // });

  if (!to.meta.requiresAuth) {
    next();
    return;
  }

  if (userStore.userLoggedIn) {
    next();
  } else {
    next({ name: "home" });
  }

  // loop功能重置與保持原樣
  const playerStore = usePlayerStore();
  const { loopedSong, currentSong } = storeToRefs(playerStore);

  if (to.params.id) {
    if (currentSong.value.sid === to.params.id && loopedSong.value.loop) {
      loopedSong.value.sid = to.params.id;
      loopedSong.value.loop = true;
    } else {
      loopedSong.value.sid = "";
      loopedSong.value.loop = false;
    }
  }
});

const { width } = useWindowSize();
router.afterEach((to) => {
  if (to.path !== "/user-info" && to.path !== "/manage-music") {
    return;
  }
  if (to.path === "/user-info" && width.value >= 1024) {
    router.replace("/manage-music");
  }
  window.addEventListener("resize", () => {
    if (to.path === "/user-info" && width.value >= 1024) {
      router.replace("/manage-music");
    }
  });
});

export default router;
