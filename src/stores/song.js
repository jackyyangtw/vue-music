import { defineStore } from "pinia";
import { songsCollection } from "../includes/firebase";
import { auth } from "@/includes/firebase";
import { ref, watch, computed, watchEffect } from "vue";
import { useRoute } from "vue-router";

export const useSongStore = defineStore("song", () => {
  const route = useRoute();
  const allSongs = ref([]);
  const needToFetchAllSong = ref(true);
  const fetchAllSongCount = ref(0);
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
    fetchAllSongCount.value += 1;
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

  // 如果任一歌曲資料有變更，needToFetchAllSong set to true
  // song.modifiedName
  // allSongs.value.some((song) => {
  //   watchEffect(() => {
  //     console.log(song.modifiedName);
  //     needToFetchAllSong.value = true;
  //     console.log(needToFetchAllSong.value);
  //   });
  // });

  const routePath = computed(() => route.path);
  watch(routePath, () => {
    console.log("route change");
  });

  return {
    allSongs,
    needToFetchAllSong,
    allSongLength,
    userSongs,
    needToFetchUserSong,
    fetchAllSongCount,
    getAllSongs,
    getUserSongs,
    removeUserSong,
  };
});

// 判斷歌曲是否有新增
// 1. allSong arr 是否變更
