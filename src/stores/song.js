// import { def } from "@vue/shared";
import { defineStore } from "pinia";
import { songsCollection } from "../includes/firebase";
export default defineStore("song", {
  state: () => ({
    allSongs: [],
  }),
  actions: {
    async getAllSongs() {
      const snapshot = await songsCollection.get();
      // this.allSongs = snapshot.docs.map((doc) => doc.data());
      // console.log("get all song");
      snapshot.docs.forEach((doc) => this.allSongs.push(doc.data()));
    },
  },
});
