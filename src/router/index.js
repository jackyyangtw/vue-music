import { createRouter, createWebHistory } from "vue-router";

import useUserStore from "@/stores/user";

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
  if (!to.meta.requiresAuth) {
    next();
    return;
  }

  const userStore = useUserStore();
  if (userStore.userLoggedIn) {
    next();
  } else {
    next({ name: "home" });
  }
});

export default router;
