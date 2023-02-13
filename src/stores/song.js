import { defineStore } from "pinia";
import { songsCollection } from "../includes/firebase";
import { auth } from "@/includes/firebase";
import { ref, watch, computed } from "vue";
// import { useRoute } from "vue-router";

export const useSongStore = defineStore("song", () => {
  // const route = useRoute();
  const allSongs = ref([]);
  const needToFetchAllsong = ref(true); // 如果資料有變更、頁面第一次載入時
  const fetchAllSongCount = ref(0);
  const needToFetchUserSong = ref(false);
  const userSongs = ref([]);

  const removeUserSong = (index) => {
    userSongs.value.splice(index, 1);
  };

  const updateSingleStoreSong = (sid, updatedVal) => {
    let updatedSong = allSongs.value.find((song) => song.docID === sid);
    Object.assign(updatedSong, updatedVal);
  };

  const getAllSongs = async () => {
    const snapshot = await songsCollection.get();
    snapshot.docs.forEach((doc) => {
      const docID = doc.data().docID;
      // 如果資料沒變更
      const thisSongId = allSongs.value.find((song) => song.docID === docID);
      if (thisSongId) {
        return;
      }
      allSongs.value.push(doc.data());
    });
    fetchAllSongCount.value += 1;
  };

  const getUserSongs = async () => {
    const snapshot = await songsCollection
      .where("uid", "==", auth.currentUser.uid)
      .get();
    snapshot.forEach((doc) => {
      console.log(doc);
      userSongs.value.push(doc.data());
    });
    needToFetchAllsong.value = false;
  };

  const allSongLength = computed(() => allSongs.value.length);
  watch(allSongLength, (newVal, oldVal) => {
    if (newVal === oldVal) {
      needToFetchAllsong.value = false;
    } else if (newVal !== oldVal) {
      needToFetchAllsong.value = true;
    }
  });

  return {
    allSongs,
    needToFetchAllsong,
    allSongLength,
    userSongs,
    needToFetchUserSong,
    fetchAllSongCount,
    getAllSongs,
    getUserSongs,
    removeUserSong,
    updateSingleStoreSong,
  };
});

// 判斷歌曲是否有新增
// 1. allSong arr 是否變更
