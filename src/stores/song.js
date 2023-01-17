import { defineStore } from "pinia";
import { songsCollection } from "../includes/firebase";
import { auth } from "@/includes/firebase";
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";

export const useSongStore = defineStore("song", () => {
  const route = useRoute();
  const allSongs = ref([]);
  const needToFetchAllSong = ref(false);
  const needToFetchUserSong = ref(false);
  const userSongs = ref([]);

  const removeUserSong = (index) => {
    userSongs.value.splice(index, 1);
  };

  const getAllSongs = async () => {
    console.log("get all songs");
    const snapshot = await songsCollection.get();
    snapshot.docs.forEach((doc) => {
      const docID = doc.data().docID;
      const thisSongId = allSongs.value.find((song) => song.docID === docID);
      if (thisSongId) {
        return;
      }
      allSongs.value.push(doc.data());
    });
  };

  const getUserSongs = async () => {
    console.log("get user songs");
    const snapshot = await songsCollection
      .where("uid", "==", auth.currentUser.uid)
      .get();
    snapshot.forEach((doc) => {
      userSongs.value.push(doc.data());
    });
    needToFetchAllSong.value = false;
  };

  const allSongLength = computed(() => allSongs.value.length);
  watch(allSongLength, (newVal, oldVal) => {
    if (newVal === oldVal) {
      needToFetchAllSong.value = false;
    } else if (newVal !== oldVal) {
      needToFetchAllSong.value = true;
    }
  });

  const routePath = computed(() => route.path);
  watch(routePath, () => {
    console.log("route change");
  });

  const getSingleSong = async () => {};

  return {
    allSongs,
    needToFetchAllSong,
    allSongLength,
    userSongs,
    needToFetchUserSong,
    getAllSongs,
    getSingleSong,
    getUserSongs,
    removeUserSong,
  };
});

// 判斷歌曲是否有新增
// 1. allSong arr 是否變更
