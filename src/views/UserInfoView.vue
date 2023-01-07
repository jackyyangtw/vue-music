<template>
  <div class="m-5">
    <div v-if="!userLoggedIn">
      <p class="text-center pb-5">請登入使用管理功能</p>
      <a
        @click.prevent="toggleModal"
        class="block py-1 rounded-xl mx-auto text-center flex justify-center items-center max-w-[80%] h-48 border"
        href="#"
      >
        <div class="text-white text-gray-700">
          <i class="fas fa-user text-6xl"></i>
          <p class="pt-4">{{ $t("header.login") }}</p>
        </div>
      </a>
    </div>
    <div v-else>
      <UserInfo
        class="md:flex"
        :userData="userData"
        :isUserInfoLoading="isUserInfoLoading"
        :addUserInfo="addUserInfo"
        :forceUpdate="forceUpdate"
        :getUserData="getUserData"
      ></UserInfo>
      <div class="grid grid-rows-1 grid-flow-col gap-4">
        <div
          class="block py-1 rounded mx-auto text-center flex flex-col justify-center items-center w-full h-48 border"
        >
          <i class="fas fa-language text-4xl"></i>
          <p class="">更改語言</p>
        </div>
        <a
          class="block py-1 rounded mx-auto text-center flex flex-col justify-center items-center w-full h-48 border"
          href="#"
          @click.prevent="signOut"
        >
          <i class="fas fa-sign-out-alt text-4xl"></i>{{ $t("header.logout") }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
// import { useWindowSize } from "@vueuse/core";
import useUserStore from "../stores/user";
import useModalStore from "../stores/modal";
import UserInfo from "../components/UserInfo.vue";
export default {
  components: {
    UserInfo,
  },
  async created() {
    if (Object.keys(this.userData).length !== 0) {
      return;
    }
    if (this.userLoggedIn) {
      this.getUserData();
    }
  },
  watch: {
    userLoggedIn(newVal) {
      setTimeout(() => {
        if (newVal === true) {
          this.getUserData();
        }
      }, 3000);
    },
  },
  data() {
    return {
      isUserInfoLoading: false,
    };
  },
  computed: {
    ...mapState(useUserStore, ["userData", "userLoggedIn"]),
  },
  methods: {
    ...mapActions(useUserStore, ["getUserDataAction", "signoutAction"]),
    ...mapActions(useModalStore, ["toggleModal"]),
    async getUserData() {
      this.isUserInfoLoading = true;
      await this.getUserDataAction();
      this.isUserInfoLoading = false;
    },
    addUserInfo(document) {
      const userInfo = {
        ...document.data(),
      };
      this.userData = userInfo;
    },
    forceUpdate() {
      this.$forceUpdate();
    },
    signOut() {
      this.signoutAction();
      if (this.$route.meta.requiresAuth) {
        this.$router.push({ name: "home" });
      }
    },
    // redirectManagePage() {
    //   const { width } = useWindowSize();
    //   if (width.value >= 1024) {
    //     this.$router.replcae("/manage");
    //   } else {
    //     return;
    //   }
    // },
  },
  // beforeRouteEnter() {
  //   this.redirectManagePage();
  // },
};
</script>

<style lang="scss" scoped></style>
