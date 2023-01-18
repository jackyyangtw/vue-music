<template>
  <section class="container mx-auto mt-6 rel">
    <div class="md:grid md:grid-cols-2 2xl:grid-cols-3 md:gap-4 mx-5 xl:mx-0">
      <div class="col-span-1">
        <UserInfo
          class="hidden lg:flex"
          :userData="userData"
          :isUserInfoLoading="isUserInfoLoading"
          :addUserInfo="addUserInfo"
          :getUserData="getUserData"
        ></UserInfo>
        <AppUpload ref="upload" :addSong="addSong"></AppUpload>
      </div>
      <div class="md:col-span-1 2xl:col-span-2 mt-5 md:mt-0">
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
            <div>
              <CompositionItem
                v-for="(song, index) in userSongs"
                :key="song.docID"
                :song="song"
                :updateSong="updateSong"
                :index="index"
                :updateUnsavedFlag="updateUnsavedFlag"
              ></CompositionItem>
              <div
                class="text-center"
                v-if="!userSongs.length && !isSongLoading"
              >
                No song found, let's upload song now : )
              </div>
            </div>
            <div v-if="isSongLoading">
              <div
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
import AppUpload from "@/components/Upload.vue";
import CompositionItem from "../components/CompositionItem.vue";
import ComfirmModal from "../components/ComfirmModal.vue";
import UserInfo from "../components/UserInfo.vue";
import { useUserStore } from "../stores/user";
import { useSongStore } from "../stores/song";
import { storeToRefs } from "pinia";
import { ref } from "vue";
export default {
  components: { AppUpload, CompositionItem, ComfirmModal, UserInfo },
  name: "manage",
  setup() {
    const userStore = useUserStore();
    const { getUserDataAction } = userStore;
    const { userData } = storeToRefs(userStore);

    const songStore = useSongStore();
    const { getUserSongs, removeUserSong } = songStore;
    const { allSongs, allSongLength, userSongs } = storeToRefs(songStore);

    const unsavedFlag = ref(false);
    const isSongLoading = ref(false);
    const isUserInfoLoading = ref(false);

    const getUserData = async () => {
      isUserInfoLoading.value = true;
      await getUserDataAction();
      isUserInfoLoading.value = false;
    };
    const getSongData = async () => {
      isSongLoading.value = true;
      await getUserSongs();
      isSongLoading.value = false;
    };
    const updateSong = (index, values) => {
      userSongs.value[index].modifiedName = values.modifiedName;
      userSongs.value[index].genre = values.genre;
    };

    const removeSongData = (index) => {
      allSongs.value.splice(index, 1);
      removeUserSong(index);
    };

    const addSong = (document) => {
      const song = {
        ...document.data(), // get firebase document data
      };
      userSongs.value.push(song);
    };

    const addUserInfo = (document) => {
      const userInfo = {
        ...document.data(),
      };
      userData.value = userInfo;
    };

    const updateUnsavedFlag = (value) => {
      unsavedFlag.value = value;
    };
    return {
      isUserInfoLoading,
      allSongs,
      userData,
      isSongLoading,
      allSongLength,
      userSongs,
      getUserData,
      getSongData,
      updateSong,
      removeSongData,
      addSong,
      addUserInfo,
      updateUnsavedFlag,
    };
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
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (
        Object.keys(vm.userData).length !== 0 &&
        Object.keys(vm.userSongs).length !== 0
      ) {
        return;
      }
      vm.getSongData();
      vm.getUserData();
    });
  },
};
</script>
