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
import { mapActions } from "pinia";
// import { useWindowSize } from "@vueuse/core";
// import useUserStore from "../stores/user";
import useModalStore from "../stores/modal";
import UserInfo from "../components/UserInfo.vue";
import { useUserStore } from "../stores/user";
import { watch, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
export default {
  components: {
    UserInfo,
  },
  setup() {
    const userStore = useUserStore();
    const route = useRoute();
    const router = useRouter();
    const { getUserDataAction, signoutAction } = userStore;
    const { userData, userLoggedIn } = storeToRefs(userStore);
    const isUserInfoLoading = ref(false);

    const getUserData = async () => {
      isUserInfoLoading.value = true;
      await getUserDataAction();
      isUserInfoLoading.value = false;
    };
    const addUserInfo = (document) => {
      const userInfo = {
        ...document.data(),
      };
      userData.value = userInfo;
    };
    const signOut = async () => {
      signoutAction();
      if (route.meta.requiresAuth) {
        router.push({ name: "home" });
      }
    };

    watch(userLoggedIn, (newVal) => {
      setTimeout(() => {
        if (newVal === true) {
          getUserData();
        }
      }, 3000);
    });

    return {
      userData,
      isUserInfoLoading,
      userLoggedIn,
      addUserInfo,
      getUserData,
      signOut,
    };
  },
  async beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (Object.keys(vm.userData).length !== 0) {
        return;
      }
      if (vm.userLoggedIn) {
        vm.getUserData();
      }
    });
  },
  methods: {
    ...mapActions(useModalStore, ["toggleModal"]),
  },
};
</script>

<style lang="scss" scoped></style>