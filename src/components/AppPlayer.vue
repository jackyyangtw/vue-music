<template>
  <div class="fixed bottom-0 left-0 bg-white px-4 py-2 w-full">
    <!-- Track Info -->
    <div class="text-center" v-if="currentSong.modifiedName">
      <span class="song-title font-bold">{{ currentSong.modifiedName }}</span>
      by
      <span class="song-artist">{{ currentSong.displayName }}</span>
    </div>
    <div class="flex flex-nowrap gap-4 items-center">
      <!-- Play/Pause Button -->
      <button type="button" @click.prevent="toggleAudio(song)">
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
</template>

<script>
import { usePlayerStore } from "../stores/player";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { songsCollection } from "../includes/firebase";
import { watchEffect } from "vue";
export default {
  setup() {
    const song = ref({});
    const playerStore = usePlayerStore();
    const route = useRoute();
    const {
      playing,
      duration,
      seek,
      playerProgress,
      currentSong,
      isDifferentSong,
    } = storeToRefs(playerStore);
    const { toggleAudio, updateSeek } = playerStore;
    watchEffect(() => {
      song.value = currentSong.value;
    });
    // watch route不同給予不同首歌
    // watchEffect(() => {
    //   if (route.params.id) {
    //     // 如果目前有歌曲撥放，並且是同一首歌
    //     if (currentSong.sid && !isDifferentSong) {
    //       song.value = currentSong.value;
    //     } else if (currentSong.sid && isDifferentSong) {
    //       const getNewSongData = async () => {
    //         const docSnapshot = await songsCollection
    //           .doc(route.params.id)
    //           .get();
    //         return docSnapshot.data();
    //       };
    //       song.value = getNewSongData();
    //     }
    //     // 如果目前有歌曲撥放，並且是不同首歌
    //   }
    // });

    return {
      song,
      playerStore,
      playing,
      duration,
      seek,
      playerProgress,
      currentSong,
      isDifferentSong,
      toggleAudio,
      updateSeek,
    };
  },
};
</script>

<style lang="scss" scoped></style>
