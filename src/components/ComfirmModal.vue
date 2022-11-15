<template>
  <teleport to="body">
    <transition name="fadeUp" @after-leave="isDeleting = false">
      <div
        v-show="isComfirmModalOpen"
        class="flex items-center justify-center pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <!-- backdrop -->
        <div
          class="fixed inset-0 transition-opacity"
          @click="closeComfirmModal"
        >
          <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
        </div>
        <!-- content -->
        <div
          class="content ab-center inline-block align-bottom bg-white text-left overflow-hidden shadow-xl transition-all p-5 rounded-lg sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="text-2xl font-bold pb-5" v-if="!isDeleting">
            <svg
              aria-hidden="true"
              class="mx-auto mb-4 w-20 h-20 text-gray-400 dark:text-black-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div class="pb-3">Are you sure you want to delete this song?</div>
            <div class="text-green-500 italic pb-3">
              {{ song.modifiedName }}
            </div>
          </div>
          <div class="text-2xl font-bold" v-else>Deleting song...</div>

          <!-- buttons -->
          <div class="flex justify-end items-center pb-4">
            <div
              class="cursor-pointer bg-blue-500 hover:bg-blue-400 p-3 rounded text-white mr-5"
            >
              <button @click="closeComfirmModal">Cancel</button>
            </div>
            <div
              class="cursor-pointer bg-red-500 text-white p-3 rounded hover:bg-red-400"
              @click="deleteSong"
            >
              Delete
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import useModalStore from "@/stores/modal";
import { mapActions, mapState } from "pinia";
import { storage, songsCollection } from "../includes/firebase";
export default {
  data() {
    return {
      isDeleting: false,
      delete: {},
    };
  },
  computed: {
    ...mapState(useModalStore, ["isComfirmModalOpen", "song", "index"]),
  },
  props: ["removeSongData"],
  methods: {
    ...mapActions(useModalStore, ["closeComfirmModal"]),
    async deleteSong() {
      // delete storage file
      const storeRef = storage.ref();
      const songRef = storeRef.child(`song/${this.song.originialName}`);
      this.isDeleting = true;

      await songRef.delete();
      // delete data
      await songsCollection.doc(this.song.docID).delete();

      this.removeSongData(this.index);
      this.closeComfirmModal();
    },
  },
};
</script>

<style scoped>
.fadeUp-enter-active {
  animation: fadeUp 0.3s;
}
.fadeUp-leave-active {
  animation: fadeUp 0.3s reverse;
}
/* .fadeUp-enter-from {
  transform: translateY(-60%);
  transition: 0.3s;
}
.fadeUp-leave-to {
  transform: translateY(-50%);
  transition: 0.3s;
} */

@keyframes fadeUp {
  0% {
    opacity: 0;
    /* transform: translate(-50%, -80%); */
  }
  100% {
    opacity: 1;
    /* transform: translate(-50%, -50%); */
  }
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>
