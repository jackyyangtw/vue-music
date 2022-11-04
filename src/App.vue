<template>
  <!-- Header -->
  <AppHeader></AppHeader>

  <router-view></router-view>

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

<style lang="scss" scoped></style>
