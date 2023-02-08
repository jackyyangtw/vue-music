<template>
  <header id="header" class="bg-gray-800">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <!-- exact-active-class="no-active" 讓此router-link不會加上active class -->
      <router-link
        class="text-white font-bold uppercase text-2xl mr-4"
        :to="{ name: 'home' }"
        exact-active-class="no-active"
        >Music</router-link
      >
      <div class="hidden lg:flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <!-- <li>
            <router-link class="px-2 text-white" :to="{ name: 'about' }">{{
              $t("header.about")
            }}</router-link>
          </li> -->

          <!-- login button -->
          <li v-if="!userLoggedIn">
            <a @click.prevent="toggleModal" class="px-2 text-white" href="#">{{
              $t("header.login")
            }}</a>
          </li>

          <!-- manage & logout -->
          <template v-else>
            <li>
              <router-link class="px-2 text-white" :to="{ name: 'manage' }">{{
                $t("header.manage")
              }}</router-link>
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="signOut">{{
                $t("header.logout")
              }}</a>
            </li>
          </template>
        </ul>
        <div class="ml-auto relative">
          <a
            href="#"
            class="px-2 text-white text-yellow-500"
            @mouseenter="showLanguageBox"
          >
            {{ currentLocale ? currentLocale.displayName : "English" }}
          </a>
          <ul
            class="absolute z-10 bg-gray-800 w-40 right-[-45px] mt-2"
            v-show="isLanguageBoxShow"
          >
            <li
              class="cursor-pointer text-center p-2 text-white hover:text-yellow-500"
              :class="{
                'text-yellow-500':
                  currentLocale.displayName === locale.displayName,
              }"
              v-for="locale in locales"
              :key="locale.locale"
              @click.prevent="changeLocale(locale)"
            >
              {{ locale.displayName }}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useUserStore } from "@/stores/user";
import { useModalStore } from "../stores/modal";
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";

const locales = ref([]);
const currentLocale = ref({});
const isLanguageBoxShow = ref(false);

const modalStore = useModalStore();
const { toggleModal } = modalStore;

const userStore = useUserStore();
const { signoutAction } = userStore;
const { userLoggedIn } = storeToRefs(userStore);

const router = useRouter();
const route = useRoute();
const signOut = () => {
  signoutAction();
  if (route.meta.requiresAuth) {
    router.push({ name: "home" });
  }
};

const changeLocale = (localObj) => {
  currentLocale.value = localObj;
  localStorage.setItem("currentLanguage", JSON.stringify(localObj));
  location.reload();
};

const showLanguageBox = () => {
  isLanguageBoxShow.value = !isLanguageBoxShow.value;
};

// created
const i18n = useI18n();
Object.keys(i18n.messages.value).forEach((key) => {
  let displayName;
  if (key === "en") displayName = "English";
  if (key === "tw") displayName = "繁體中文";
  locales.value.push({
    locale: key,
    displayName,
  });
});

const currentLangueage = localStorage.getItem("currentLanguage");
const currentLangueageObj = currentLangueage
  ? JSON.parse(currentLangueage)
  : "";
if (currentLangueageObj) {
  i18n.locale.value = currentLangueageObj.locale;
  currentLocale.value = currentLangueageObj;
}
</script>
