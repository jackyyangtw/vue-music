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
          <h1 class="font-bold text-5xl mb-5">{{ $t("home.listen") }}</h1>
          <p class="w-full md:w-8/12 mx-auto">
            {{ $t("home.desc") }}
          </p>
        </div>
      </div>

      <img
        class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="/assets/img/introduction-music.png"
      />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div
          class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
          v-icon-secondary="{ icon: 'headphones-alt', right: true }"
        >
          <span class="card-title">Songs</span>
          <!-- Icon -->
        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <SongItem
            v-for="song in songs"
            :key="song.docID"
            :song="song"
          ></SongItem>

          <!-- skeleton -->
          <div v-if="isContentLoading">
            <div
              class="p-3 pl-6 rounded animate-pulse flex justify-between align-center"
              v-for="i in maxPerPage"
              :key="i"
            >
              <div>
                <div
                  class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-[360px] max-w-[360px] my-3"
                ></div>
                <div
                  class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-[150px] max-w-[360px]"
                ></div>
              </div>
              <div class="flex text-[18px]">
                <i class="fa fa-comments text-gray-600 mr-2"></i>0
              </div>
            </div>
          </div>
        </ol>
        <!-- .. end Playlist -->
      </div>
    </section>
  </main>
</template>

<script>
import { songsCollection } from "../includes/firebase";
import SongItem from "../components/SongItem.vue";
import IconSecondary from "../directives/icon-secondary";
export default {
  name: "Home",
  components: {
    SongItem,
  },
  data() {
    return {
      songs: [],
      maxPerPage: 5,
      pendingRequest: false,
      isContentLoading: false,
      fetchCount: 0,
    };
  },

  // local directive
  directives: {
    "icon-secondary": IconSecondary,
  },
  async created() {
    this.getSongs();
    window.addEventListener("scroll", this.scrollHandler);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.scrollHandler);
  },
  computed: {
    isFetchingComplete() {
      if (this.fetchCount * this.maxPerPage >= this.songs.length) {
        return true;
      }
      return false;
    },
  },
  methods: {
    async scrollHandler() {
      const { scrollTop, offsetHeight } = document.documentElement; // scrollTop: view以上的總高度，offsetHeight: 頁面總高度
      const { innerHeight } = window; // view的高度
      const isBottomOfWindow =
        Math.round(scrollTop) + innerHeight === offsetHeight;

      if (isBottomOfWindow) {
        console.log("bottom of window");
        this.getSongs();
      }
    },
    async getSongs() {
      if (this.pendingRequest) {
        return;
      }

      this.pendingRequest = true;
      let snapshot;
      this.isContentLoading = true;

      if (this.songs.length) {
        // 最後一筆data
        const lastDoc = await songsCollection
          .doc(this.songs[this.songs.length - 1].docID)
          .get();
        snapshot = await songsCollection
          .orderBy("modifiedName")
          .startAfter(lastDoc)
          .limit(this.maxPerPage) // 限制取得的data數
          .get();
        this.fetchCount += 1;
      } else {
        // 第一次載入頁面的時候

        snapshot = await songsCollection
          .orderBy("modifiedName")
          .limit(this.maxPerPage)
          .get();
      }

      snapshot.forEach((document) => {
        this.songs.push({
          docID: document.id,
          ...document.data(),
        });
      });
      if (this.isFetchingComplete) {
        this.isContentLoading = false;
        return;
      }
      this.isContentLoading = false;
      this.pendingRequest = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
