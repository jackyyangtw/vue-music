<template>
  <section class="container mx-auto mt-6 rel">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <UserInfo
          :userData="userData"
          :isUserInfoLoading="isUserInfoLoading"
          :addUserInfo="addUserInfo"
          :forceUpdate="forceUpdate"
          :getUserData="getUserData"
        ></UserInfo>
        <AppUpload ref="upload" :addSong="addSong"></AppUpload>
      </div>
      <div class="col-span-2">
        <div
          class="bg-white rounded border border-gray-200 relative flex flex-col"
        >
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">{{ $t("manage.my_song") }}</span>
            <i
              class="fa fa-compact-disc float-right text-green-400 text-2xl"
            ></i>
          </div>
          <div class="p-6">
            <CompositionItem
              v-for="(song, index) in songs"
              :key="song.docID"
              :song="song"
              :updateSong="updateSong"
              :index="index"
              :removeSongData="removeSongData"
              :updateUnsavedFlag="updateUnsavedFlag"
            ></CompositionItem>
            <div class="text-center" v-if="!songs.length && !isContentLoading">
              No song found, let's upload song now : )
            </div>
            <div v-if="isContentLoading">
              <div
                v-for="song in 3"
                :key="song"
                class="border border-gray-200 p-3 mb-4 rounded animate-pulse flex justify-between align-center"
              >
                <div
                  class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-[320px] max-w-[360px] my-3"
                ></div>
                <div class="flex">
                  <div class="rounded w-6 h-6 dark:bg-gray-700 mr-2"></div>
                  <div class="rounded w-6 h-6 dark:bg-gray-700"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ComfirmModal :removeSongData="removeSongData"></ComfirmModal>
  </section>
</template>

<script>
// import useUserStore from "@/stores/user";
import AppUpload from "@/components/Upload.vue";
import { songsCollection, auth, usersCollection } from "../includes/firebase";
import CompositionItem from "../components/CompositionItem.vue";
import ComfirmModal from "../components/ComfirmModal.vue";
import UserInfo from "../components/UserInfo.vue";
export default {
  components: { AppUpload, CompositionItem, ComfirmModal, UserInfo },
  name: "manage",
  async created() {
    this.isContentLoading = true;
    this.isUserInfoLoading = true;

    // 取得 song snapshot(copy of firebase document)
    const snapshot = await songsCollection
      .where("uid", "==", auth.currentUser.uid)
      .get();

    const userSnapshot = await usersCollection.doc(auth.currentUser.uid).get();
    const userData = userSnapshot.data();
    this.userData = {
      ...userData,
    };

    snapshot.forEach(this.addSong);
    this.isContentLoading = false;
    this.isUserInfoLoading = false;
  },
  data() {
    return {
      songs: [],
      unsavedFlag: false,
      isContentLoading: false,
      isUserInfoLoading: false,
      userData: {},
    };
  },
  // watch: {
  //   userData(newVal) {
  //     if (newVal) {
  //       this.isUserInfoLoading = false;
  //     }
  //   },
  //   songs(newVal) {
  //     if (newVal) {
  //       this.isContentLoading = false;
  //     }
  //   },
  // },
  methods: {
    async getUserData() {
      this.isUserInfoLoading = true;
      const userSnapshot = await usersCollection
        .doc(auth.currentUser.uid)
        .get();
      const userData = userSnapshot.data();
      this.userData = {
        ...userData,
      };
      this.isUserInfoLoading = false;
    },
    updateSong(index, values) {
      this.songs[index].modifiedName = values.modifiedName;
      this.songs[index].genre = values.genre;
    },
    removeSongData(index) {
      this.songs.splice(index, 1);
    },
    addSong(document) {
      const song = {
        ...document.data(), // get firebase document data
        docID: document.id,
      };
      this.songs.push(song);
    },
    addUserInfo(document) {
      const userInfo = {
        ...document.data(),
      };
      this.userData = userInfo;
    },
    updateUnsavedFlag(value) {
      this.unsavedFlag = value;
    },
    forceUpdate() {
      this.$forceUpdate();
    },
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next();
    } else {
      const leave = confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      next(leave);
    }
  },
  // beforeRouteEnter(to, from, next) {
  //   const store = useUserStore();
  //   if (store.userLoggedIn) {
  //     next();
  //   } else {
  //     next({ name: "home" });
  //   }
  // },
};
</script>
