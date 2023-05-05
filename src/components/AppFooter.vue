<template>
  <div class="flex lg:hidden bg-gray-600 pb-5 pt-1">
    <router-link
      to="/"
      class="w-[33.333%] py-1 text-white text-center m-0"
      :class="{
        'w-[33.333%]': userLoggedIn,
        'w-[50%]': !userLoggedIn,
      }"
    >
      {{ $t("mobile.footer.home") }}<i class="block fas fa-home text-white"></i>
    </router-link>
    <router-link
      to="/manage-music"
      class="w-[33.333%] py-1 text-white text-center m-0"
      v-if="userLoggedIn"
    >
      {{ $t("mobile.footer.upload")
      }}<i class="block fas fa-upload text-white"></i>
    </router-link>
    <router-link
      to="/user-info"
      class="w-[33.333%] py-1 text-white text-center m-0"
      :class="{
        'w-[33.333%]': userLoggedIn,
        'w-[50%]': !userLoggedIn,
      }"
    >
      {{ $t("mobile.footer.manage")
      }}<i class="block fas fa-tasks text-white"></i>
    </router-link>
  </div>
</template>

<script setup>
import { useUserStore } from "../stores/user";
const { userLoggedIn } = useUserStore();
</script>
