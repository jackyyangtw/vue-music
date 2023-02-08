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
    console.log("clicked");
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
