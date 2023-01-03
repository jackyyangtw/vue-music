import { createRouter, createWebHistory } from "vue-router";

import useUserStore from "@/stores/user";
import { usePlayerStore } from "../stores/player";
import { watch, ref } from "vue";
import { storeToRefs } from "pinia";

const HomeView = () => import("@/views/HomeView.vue");
const ManageView = () => import("@/views/ManageView.vue");
const SongView = () => import("@/views/SongView.vue");
const AboutView = () => import("@/views/AboutView.vue");

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
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
  if (!to.meta.requiresAuth) {
    next();
    return;
  }
  if (userStore.userLoggedIn) {
    next();
  } else {
    next({ name: "home" });
  }
});

// loop功能重置與保持原樣
router.afterEach((to) => {
  const { sid, loopedSong, isDifferentSong } = storeToRefs(usePlayerStore());
  if (to.params.id) {
    if (!isDifferentSong.value) {
      console.log("same song");
      // loopedSong.value.sid = newSid.value;
      // loopedSong.value.loop = true;
      // loopedSong.value.firebaseSid = to.params.id;
      // return;
    } else {
      console.log("different song");
      loopedSong.value.sid = "";
      loopedSong.value.loop = false;
      loopedSong.value.firebaseSid = "";
    }

    // watch(sid, (newVal) => {
    //   newSid.value = newVal;
    // });

    // const newSid = ref("");

    // watch(sid, (newVal, oldVal) => {
    //   console.log(newVal, oldVal);
    //   // if (newVal && newVal !== oldVal) {
    //   //   loopedSong.value.loop = false;
    //   // }
    //   // console.log(loopedSong.value.loop);
    // });
  }
});

export default router;
