<template>
  <!-- Header -->
  <AppHeader></AppHeader>

  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component"></component>
    </transition>
  </router-view>

  <!-- Player -->
  <AppPlayer></AppPlayer>

  <!-- Auth Modal -->
  <AppAuth></AppAuth>
</template>

<script>
import AppHeader from "./components/AppHeader.vue";
import AppAuth from "./components/AppAuth.vue";
import AppPlayer from "./components/AppPlayer.vue";
import { mapWritableState } from "pinia";
import useUserStore from "@/stores/user";
import { auth } from "./includes/firebase";

export default {
  components: {
    AppHeader,
    AppAuth,
    AppPlayer,
  },
  name: "app",
  computed: {
    ...mapWritableState(useUserStore, ["userLoggedIn"]),
  },
  created() {
    // firebase check 是否有currrentUser
    if (auth.currentUser) {
      this.userLoggedIn = true;
    }

  },
};
</script>

<style>
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: 0.5s linear;
}
.fade-leave-to {
  transition: 0.5s linear;
}
.ab-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
