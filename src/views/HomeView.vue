<template>
  <main>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"
      ></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-3xl md:text-5xl mb-5">
            {{ $t("home.listen") }}
          </h1>
          <p class="w-full md:w-8/12 mx-auto">
            {{ $t("home.desc") }}
          </p>
        </div>
      </div>

      <img
        class="relative block p-5 mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="/assets/img/introduction-music.png"
      />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
      <div class="rounded border border-gray-200 relative flex flex-col mx-5">
        <div
          class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
          v-icon-secondary="{ icon: 'headphones-alt', right: true }"
        >
          <span class="card-title">Songs</span>
          <!-- Icon -->
        </div>
        <!-- Playlist -->
        <ol id="playlist" v-if="!needToFetchAllsong">
          <SongItem
            v-for="song in allSongs"
            :key="song.docID"
            :song="song"
          ></SongItem>
        </ol>
        <ol v-else-if="needToFetchAllsong">
          <SongItem
            v-for="song in songs"
            :key="song.docID"
            :song="song"
          ></SongItem>
        </ol>
        <!-- skeleton -->
        <div v-if="isContentLoading && needToFetchAllsong">
          <div
            class="p-3 pl-6 rounded animate-pulse flex justify-between align-center w-full"
            v-for="i in maxPerPage"
            :key="i"
          >
            <div>
              <div
                class="h-2 rounded-full dark:bg-white w-[200px] max-w-[200px] md:w-[360px] md:max-w-[360px] my-3"
              ></div>
              <div
                class="h-2 rounded-full dark:bg-white w-[150px] max-w-[360px]"
              ></div>
            </div>
            <div class="flex text-[18px] text-white">
              <i class="fa fa-comments mr-2"></i>0
            </div>
          </div>
        </div>
        <!-- .. end Playlist -->
      </div>
    </section>
  </main>
</template>

<script>
import { songsCollection } from "../includes/firebase";
import SongItem from "../components/SongItem.vue";
import IconSecondary from "../directives/icon-secondary";
import { useSongStore } from "../stores/song";
import { storeToRefs } from "pinia";
import { ref, onMounted, onBeforeUnmount, watchEffect } from "vue";
export default {
  name: "Home",
  components: {
    SongItem,
  },
  setup() {
    const songStore = useSongStore();
    const { needToFetchAllsong, allSongs } = storeToRefs(songStore);
    const { getAllSongs } = songStore;

    const songs = ref([]);
    const pendingRequest = ref(false);
    const isContentLoading = ref(true);
    const fetchCount = ref(0);
    const isFetchingComplete = ref(false);

    const maxPerPage = 5;

    const scrollHandler = async () => {
      const { scrollTop, offsetHeight } = document.documentElement; // scrollTop: view以上的總高度，offsetHeight: 頁面總高度
      const { innerHeight } = window; // view的高度
      const isBottomOfWindow =
        Math.round(scrollTop) + innerHeight >= offsetHeight;

      if (isBottomOfWindow) {
        console.log("bottom");
        getSongs();
      }
    };

    onMounted(async () => {
      window.addEventListener("scroll", scrollHandler);
      if (needToFetchAllsong.value) {
        getAllSongs();
      }
      getSongs();
    });

    onBeforeUnmount(async () => {
      window.removeEventListener("scroll", scrollHandler);
    });

    const getSongs = async () => {
      if (pendingRequest.value) {
        return;
      }

      pendingRequest.value = true;
      let snapshot;
      if (songs.value.length) {
        // 最後一筆data
        const lastDoc = await songsCollection
          .doc(songs.value[songs.value.length - 1].docID)
          .get();
        snapshot = await songsCollection
          .orderBy("modifiedName")
          .startAfter(lastDoc)
          .limit(maxPerPage) // 限制取得的data數
          .get();
        fetchCount.value += 1;
        watchEffect(() => {
          if (allSongs.value.length === songs.value.length) {
            isFetchingComplete.value = true;
            isContentLoading.value = false;
            needToFetchAllsong.value = false;
          } else {
            isFetchingComplete.value = false;
            isContentLoading.value = true;
          }
        });
      } else {
        // 第一次載入頁面的時候
        snapshot = await songsCollection
          .orderBy("modifiedName")
          .limit(maxPerPage)
          .get();
      }

      snapshot.forEach((document) => {
        songs.value.push({
          ...document.data(),
        });
      });
      pendingRequest.value = false;
    };

    return {
      songs,
      isContentLoading,
      fetchCount,
      maxPerPage,
      needToFetchAllsong,
      allSongs,
      isFetchingComplete,
    };
  },

  // local directive
  directives: {
    "icon-secondary": IconSecondary,
  },
};
</script>
