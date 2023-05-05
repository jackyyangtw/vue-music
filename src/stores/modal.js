import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useGlobalStore } from "./global";
import { storeToRefs } from "pinia";
export const useModalStore = defineStore("modal", () => {
  const isOpen = ref(false);
  const hiddenClass = computed(() => {
    return !isOpen.value ? "hidden" : "";
  });

  const isComfirmModalOpen = ref(false);

  const globalStore = useGlobalStore();
  const { IsKeydownSpaceEventActive } = storeToRefs(globalStore);
  const { setIsKeydownSpaceEventActive } = globalStore;

  const toggleModal = () => {
    isOpen.value = !isOpen.value;
    if (IsKeydownSpaceEventActive.value) {
      setIsKeydownSpaceEventActive(false);
    } else {
      setIsKeydownSpaceEventActive(true);
    }
  };
  const closeComfirmModal = () => {
    isComfirmModalOpen.value = false;
  };
  const index = ref("");
  const song = ref({});
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
