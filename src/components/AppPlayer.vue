<template>
  <div class="fixed bottom-0 left-0 bg-white w-full">
    <!-- Track Info -->
    <div class="px-2 lg:px-4 py-2 bg-gray-600 relative">
      <!-- Scrub Container  -->
      <div class="lg:hidden absolute w-full left-0 bottom-[0px]">
        <div
          @click.prevent="updateSeek"
          class="w-full h-[3px] rounded bg-gray-200 relative cursor-pointer"
        >
          <!-- Player Progress Bar-->
          <span
            class="block h-[3px] rounded bg-gradient-to-r from-green-500 to-green-400"
            :style="{ width: playerProgress }"
          ></span>
        </div>
      </div>
      <div class="flex">
        <div
          class="text-white flex flex-col w-full max-w-full lg:max-w-[400px] mx-auto lg:py-2"
          v-if="currentSong.modifiedName"
        >
          <span class="song-title font-bold text-white">{{
            currentSong.modifiedName
          }}</span>
          <span class="song-artist text-gray-400 font-extrabold inline-block">{{
            currentSong.displayName
          }}</span>
        </div>
        <!-- Play/Pause Button -->
        <button
          type="button"
          @click.prevent="toggleAppPlayerAudio"
          class="lg:hidden"
        >
          <i
            class="fa text-white text-xl"
            :class="{ 'fa-play': !playing, 'fa-pause': playing }"
          ></i>
        </button>
      </div>
      <div class="hidden lg:flex flex-nowrap gap-4 items-center">
        <!-- Play/Pause Button -->
        <button type="button" @click.prevent="toggleAppPlayerAudio">
          <i
            class="fa text-white text-xl"
            :class="{ 'fa-play': !playing, 'fa-pause': playing }"
          ></i>
        </button>
        <!-- Current Position -->
        <div class="player-currenttime text-white">{{ seek }}</div>
        <!-- Scrub Container  -->
        <div
          @click.prevent="updateSeek"
          class="w-full h-2 rounded bg-gray-200 relative cursor-pointer"
        >
          <!-- Player Ball -->
          <span
            class="absolute -top-2.5 -ml-2.5 text-gray-400 text-lg"
            :style="{ left: playerProgress }"
          >
            <i class="fas fa-circle"></i>
          </span>
          <!-- Player Progress Bar-->
          <span
            class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
            :style="{ width: playerProgress }"
          ></span>
        </div>
        <!-- Duration -->
        <div class="player-duration text-white">{{ duration }}</div>
      </div>
    </div>
    <AppFooter></AppFooter>
  </div>
</template>

<script>
import AppFooter from "./AppFooter.vue";
import { usePlayerStore } from "../stores/player";
import { storeToRefs } from "pinia";
export default {
  components: {
    AppFooter,
  },
  setup() {
    const playerStore = usePlayerStore();

    const {
      playing,
      duration,
      seek,
      playerProgress,
      currentSong,
      isDifferentSong,
    } = storeToRefs(playerStore);

    const { toggleAppPlayerAudio, updateSeek } = playerStore;

    return {
      playerStore,
      playing,
      duration,
      seek,
      playerProgress,
      currentSong,
      isDifferentSong,
      toggleAppPlayerAudio,
      updateSeek,
    };
  },
};
</script>

<style lang="scss" scoped></style>
