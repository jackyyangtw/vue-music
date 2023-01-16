import { defineStore } from "pinia";
import { songsCollection } from "../includes/firebase";

export const useSongStore = defineStore("song", {
  state: () => ({
    allSongs: [],
    needToFetch: true,
  }),
  actions: {
    async getAllSongs() {
      const snapshot = await songsCollection.get();
      snapshot.docs.forEach((doc) => {
        console.log(doc.data());
        this.allSongs.push(doc.data());
      });
    },
    async getSingleSong() {},
  },
});

// const songStore = useSongStore();

// const { allSongs } = storeToRefs(songStore);

// watch(allSongs, () => {
//   console.log("all song array change");
// });

// 判斷歌曲是否有新增
// 1. allSong arr 是否變更
