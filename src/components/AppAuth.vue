<template>
  <BaseModal
    :isModalOpen="isAuthModalOpen"
    :showButton="false"
    @closeModal="toggleAuthModal"
  >
    <template #head>
      <!--Title-->
      <div class="flex justify-between items-center pb-4">
        <p class="text-2xl font-bold">{{ $t("header.your_account") }}</p>
        <!-- Modal Close Button -->
        <div class="modal-close cursor-pointer z-50">
          <i class="fas fa-times" @click.prevent="isAuthModalOpen = false"></i>
        </div>
      </div>
    </template>
    <template #default>
      <div class="py-4 text-left px-6">
        <!-- Tabs -->
        <ul class="flex flex-wrap">
          <li class="flex-auto text-center">
            <a
              class="block rounded py-3 px-4 transition"
              :class="{
                'hover:text-white text-white bg-blue-600': tab === 'login',
                'hover:text-blue-900': tab === 'register',
              }"
              href="#"
              @click.prevent="tab = 'login'"
              >{{ $t("header.login_tab") }}</a
            >
          </li>
          <li class="flex-auto text-center">
            <a
              class="block rounded py-3 px-4 transition"
              href="#"
              :class="{
                'hover:text-white text-white bg-blue-600': tab === 'register',
                'hover:text-blue-900': tab === 'login',
              }"
              @click.prevent="tab = 'register'"
              >{{ $t("header.register") }}</a
            >
          </li>
        </ul>

        <LoginForm v-if="tab === 'login'"></LoginForm>
        <RegisterForm v-else></RegisterForm>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import LoginForm from "./LoginForm.vue";
import RegisterForm from "./RegisterForm.vue";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useModalStore } from "../stores/modal";
const tab = ref("login");
const modalStore = useModalStore();
const { isAuthModalOpen } = storeToRefs(modalStore);
const { toggleAuthModal } = modalStore;
</script>
