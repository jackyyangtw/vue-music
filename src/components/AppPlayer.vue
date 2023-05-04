<template>
  <div class="fixed bottom-0 left-0 bg-white w-full">
    <!-- Track Info -->
    <div class="px-2 lg:px-4 py-3 bg-gray-700 relative" v-if="isPlayingSong">
      <!-- mobile player bar -->
      <div class="lg:hidden absolute w-full left-0 top-[0px]">
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
      <!-- song info -->
      <div class="flex max-w-[400px] lg:max-w-full lg:text-center mx-auto">
        <div
          class="text-white flex flex-col lg:flex-row lg:justify-center w-full max-w-full mx-auto"
          v-if="currentSong.modifiedName"
        >
          <router-link
            :to="{ name: 'song', params: { id: currentSong.docID } }"
            class="song-link song-title font-bold text-white lg:mr-3"
            >{{ currentSong.modifiedName }}</router-link
          >
          <span class="song-artist text-gray-400 font-extrabold inline-block">{{
            currentSong.displayName
          }}</span>
        </div>
        <!-- mobile play/pause button -->
        <button
          type="button"
          @click.prevent="toggleAppPlayerAudio"
          class="lg:hidden"
          id="player-play-btn-mobile"
        >
          <i
            class="fa text-white text-xl"
            :class="{ 'fa-play': !playing, 'fa-pause': playing }"
          ></i>
        </button>
      </div>
      <!-- PC player -->
      <div class="hidden lg:flex flex-nowrap gap-4 items-center">
        <!-- Play/Pause Button -->
        <button
          type="button"
          @click.prevent="toggleAppPlayerAudio"
          id="player-play-btn-pc"
        >
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

<script setup>
import AppFooter from "./AppFooter.vue";
import { usePlayerStore } from "../stores/player";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const playerStore = usePlayerStore();

const { playing, duration, seek, playerProgress, currentSong } =
  storeToRefs(playerStore);

const { toggleAppPlayerAudio, updateSeek } = playerStore;

const isPlayingSong = computed(() => {
  if (playerStore.currentSong.docID) {
    return true;
  }
  return false;
});
</script>

<style scoped>
.song-link.router-link-active {
  color: white;
}
</style>
