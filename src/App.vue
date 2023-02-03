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
import { auth } from "./includes/firebase";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { usePlayerStore } from "./stores/player";
import { useEventListener } from "@vueuse/core";
// import { watch } from "vue";
// import { useSongStore } from "./stores/song";

export default {
  components: {
    AppHeader,
    AppAuth,
    AppPlayer,
  },
  name: "app",
  setup() {
    const userStore = useUserStore();
    const playerStore = usePlayerStore();
    const { toggleAppPlayerAudio } = playerStore;
    const { currentSong } = storeToRefs(playerStore);
    const { userLoggedIn } = storeToRefs(userStore);
    if (auth.currentUser) {
      userLoggedIn.value = true;
    }

    useEventListener(document, "keydown", (e) => {
      e.preventDefault();
      if (e.key === " ") {
        toggleAppPlayerAudio(currentSong.value);
      }
    });
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
.fixed-center {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.card-title {
  color: white;
}
</style>
