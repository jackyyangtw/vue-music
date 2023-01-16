import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useModalStore = defineStore("modal", () => {
  const isOpen = ref(false);
  const hiddenClass = computed(() => {
    return !isOpen.value ? "hidden" : "";
  });

  const isComfirmModalOpen = ref(false);
  const index = ref("");
  const song = ref({});
  const toggleModal = () => {
    isOpen.value = !isOpen.value;
  };
  const closeComfirmModal = () => {
    isComfirmModalOpen.value = false;
  };
  const openComfirmModal = (songData, indexData) => {
    isComfirmModalOpen.value = true;
    song.value = songData;
    index.value = indexData;
  };

  return {
    isOpen,
    isComfirmModalOpen,
    index,
    song,
    hiddenClass,
    toggleModal,
    closeComfirmModal,
    openComfirmModal,
  };
});

// export default defineStore("modal", {
//   state: () => ({
//     isOpen: false,
//     isComfirmModalOpen: false,
//     song: {},
//     index: "",
//   }),
//   actions: {
//     toggleModal() {
//       this.isOpen = !this.isOpen;
//     },
//     closeComfirmModal() {
//       this.isComfirmModalOpen = false;
//     },
//     openComfirmModal(song, index) {
//       this.isComfirmModalOpen = true;
//       this.song = song;
//       this.index = index;
//     },
//   },
//   getters: {
//     hiddenClass(state) {
//       return !state.isOpen ? "hidden" : "";
//     },
//   },
// });
