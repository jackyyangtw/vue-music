<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <!-- exact-active-class="no-active" 讓此router-link不會加上active class -->
      <router-link
        class="text-white font-bold uppercase text-2xl mr-4"
        :to="{ name: 'home' }"
        exact-active-class="no-active"
        >Music</router-link
      >

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li>
            <router-link class="px-2 text-white" :to="{ name: 'about' }">{{
              $t("header.about")
            }}</router-link>
          </li>
          <!-- userStore => 使用mapStore才要這樣用 -->
          <li v-if="!userStore.userLoggedIn">
            <a
              @click.prevent="toggleAuthModal"
              class="px-2 text-white"
              href="#"
              >{{ $t("header.login") }}</a
            >
          </li>
          <template v-else>
            <li>
              <router-link class="px-2 text-white" :to="{ name: 'manage' }">{{
                $t("header.manage")
              }}</router-link>
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="signOut">{{
                $("header.logout")
              }}</a>
            </li>
          </template>
        </ul>
        <div class="ml-auto relative">
          <a href="#" class="px-2 text-white" @mouseenter="showLanguageBox">
            {{ currentLocale }}
          </a>
          <ul
            class="absolute z-10 bg-gray-700 w-full mt-2"
            v-show="isLanguageBoxShow"
          >
            <li
              class="cursor-pointer text-center p-2 text-white hover:text-yellow-500"
              v-for="locale in locales"
              :key="locale.locale"
              @click.prevent="changeLocale(locale.locale)"
            >
              {{ locale.displayName }}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapStores, mapWritableState } from "pinia";
import useModalStore from "@/stores/modal";
import useUserStore from "@/stores/user";
export default {
  name: "AppHeader",
  data() {
    return {
      locales: [],
      currentLocale: "en",
      isLanguageBoxShow: false,
    };
  },
  computed: {
    ...mapStores(useUserStore), // 可直接使用action、state
    ...mapWritableState(useModalStore, ["isOpen"]),
  },
  methods: {
    toggleAuthModal() {
      this.isOpen = !this.isOpen;
    },
    signOut() {
      this.userStore.signoutAction();
      if (this.$route.meta.requiresAuth) {
        this.$router.push({ name: "home" });
      }
    },
    changeLocale(lan) {
      this.currentLocale = lan;
      localStorage.setItem("currentLanguage", lan);
      location.reload();
    },
    showLanguageBox() {
      this.isLanguageBoxShow = !this.isLanguageBoxShow;
    },
  },
  created() {
    Object.keys(this.$i18n.messages).forEach((key) => {
      let displayName;
      if (key === "en") displayName = "Enhlish";
      if (key === "fr") displayName = "Français";
      if (key === "tw") displayName = "繁體中文";
      this.locales.push({
        locale: key,
        displayName,
      });
    });
    const currentLangueage = localStorage.getItem("currentLanguage");
    this.$i18n.locale = currentLangueage;
    this.currentLocale = currentLangueage;
  },
};
</script>

<style lang="scss" scoped></style>
