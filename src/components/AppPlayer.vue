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
import { mapActions, mapState } from "pinia";
import usePlayerStore from "@/stores/player";
import { songsCollection } from "../includes/firebase";
export default {
  methods: {
    ...mapActions(usePlayerStore, ["toggleAudio", "updateSeek"]),
  },
  data() {
    return {
      song: {},
    };
  },
  // async created() {
  //   const docSnapshot = await songsCollection.doc(this.$route.params.id).get();
  //   this.song = docSnapshot.data();
  //   // this.song.sid = this.$route.params.id;
  //   console.log(this.$route);
  // },
  computed: {
    ...mapState(usePlayerStore, [
      "playing",
      "duration",
      "seek",
      "playerProgress",
      "currentSong",
    ]),
  },
  watch: {
    $route: async function (to) {
      console.log(to);
      const docSnapshot = await songsCollection
        .doc(this.$route.params.id)
        .get();
      this.song = docSnapshot.data();
      if (!to.params.id) {
        return;
      }
      this.song.sid = to.params.id;
    },
  },
};
</script>

<style lang="scss" scoped></style>
