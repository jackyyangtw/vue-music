<template>
  <div class="fixed bottom-0 left-0 bg-white w-full">
    <!-- Track Info -->
    <div class="px-4 py-2">
      <div class="text-center" v-if="currentSong.modifiedName">
        <span class="song-title font-bold">{{ currentSong.modifiedName }}</span>
        by
        <span class="song-artist">{{ currentSong.displayName }}</span>
      </div>
      <div class="flex flex-nowrap gap-4 items-center">
        <!-- Play/Pause Button -->
        <button type="button" @click.prevent="toggleAppPlayerAudio">
          <i
            class="fa text-gray-500 text-xl"
            :class="{ 'fa-play': !playing, 'fa-pause': playing }"
          ></i>
        </button>
        <!-- Current Position -->
        <div class="player-currenttime">{{ seek }}</div>
        <!-- Scrub Container  -->
        <div
          @click.prevent="updateSeek"
          class="w-full h-2 rounded bg-gray-200 relative cursor-pointer"
        >
          <!-- Player Ball -->
          <span
            class="absolute -top-2.5 -ml-2.5 text-gray-800 text-lg"
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
        <div class="player-duration">{{ duration }}</div>
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
