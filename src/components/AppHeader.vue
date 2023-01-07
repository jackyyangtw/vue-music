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
          <li v-if="!userStore.userLoggedIn">
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
            {{ currentLocale.displayName || "English" }}
          </a>
          <ul
            class="absolute z-10 bg-gray-700 w-40 mt-2"
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

<script>
import { mapStores, mapActions } from "pinia";
import useModalStore from "@/stores/modal";
import useUserStore from "@/stores/user";
export default {
  name: "AppHeader",
  data() {
    return {
      locales: [],
      currentLocale: {},
      isLanguageBoxShow: false,
    };
  },
  computed: {
    ...mapStores(useUserStore), // 可直接使用action、state
  },
  methods: {
    ...mapActions(useModalStore, ["toggleModal"]),
    signOut() {
      this.userStore.signoutAction();
      if (this.$route.meta.requiresAuth) {
        this.$router.push({ name: "home" });
      }
    },
    changeLocale(localObj) {
      this.currentLocale = localObj;
      localStorage.setItem("currentLanguage", JSON.stringify(localObj));
      location.reload();
    },
    showLanguageBox() {
      this.isLanguageBoxShow = !this.isLanguageBoxShow;
    },
  },
  created() {
    Object.keys(this.$i18n.messages).forEach((key) => {
      let displayName;
      if (key === "en") displayName = "English";
      if (key === "fr") displayName = "Français";
      if (key === "tw") displayName = "繁體中文";
      this.locales.push({
        locale: key,
        displayName,
      });
    });
    const currentLangueage = localStorage.getItem("currentLanguage");
    if (!currentLangueage) {
      return;
    }
    const currentLangueageObj = JSON.parse(currentLangueage);
    this.$i18n.locale = currentLangueageObj.locale;
    this.currentLocale = currentLangueageObj;
  },
};
</script>

<style lang="scss" scoped></style>
