import { defineStore } from "pinia";
import { songsCollection } from "../includes/firebase";
import { auth } from "@/includes/firebase";
import { ref, watch, computed } from "vue";

export const useSongStore = defineStore("song", () => {
  const allSongs = ref([]);
  const showFetchedSongs = ref(false);
  const fetchAllSongCount = ref(0);
  const userSongs = ref([]);
  const oldSongLength = ref(0);
  const needToFetchUserSong = ref(false);

  const removeUserSong = (index) => {
    userSongs.value.splice(index, 1);
  };

  const updateSingleStoreSong = (sid, updatedVal) => {
    let updatedSong = allSongs.value.find((song) => song.docID === sid);
    Object.assign(updatedSong, updatedVal);
  };

  const getAllSongs = async () => {
    const snapshot = await songsCollection.get();
    const promises = snapshot.docs.map(async (doc) => {
      const docID = doc.data().docID;
      const thisSongId = allSongs.value.find((song) => song.docID === docID);
      if (thisSongId) {
        return;
      }
      allSongs.value.push(doc.data());
    });
    await Promise.all(promises);
    fetchAllSongCount.value += 1;
  };

  const getUserSongs = async () => {
    const snapshot = await songsCollection
      .where("uid", "==", auth.currentUser.uid)
      .get();
    const promises = snapshot.docs.map(async (doc) => {
      userSongs.value.push(doc.data());
    });
    await Promise.all(promises);
  };

  const allSongLength = ref(0);
  songsCollection.onSnapshot((snapshot) => {
    allSongLength.value = snapshot.size;
  });

  const addedSongsCount = computed(() => {
    if (allSongLength.value - oldSongLength.value <= 0) {
      return 0;
    }
    return allSongLength.value - oldSongLength.value;
  });

  watch(allSongLength, (newVal, oldVal) => {
    oldSongLength.value = oldVal;
  });

  return {
    allSongs,
    showFetchedSongs,
    allSongLength,
    userSongs,
    needToFetchUserSong,
    fetchAllSongCount,
    oldSongLength,
    addedSongsCount,
    getAllSongs,
    getUserSongs,
    removeUserSong,
    updateSingleStoreSong,
  };
});
