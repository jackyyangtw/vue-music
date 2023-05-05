import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useGlobalStore } from "./global";
import { storeToRefs } from "pinia";
export const useModalStore = defineStore("modal", () => {
  const isAuthModalOpen = ref(false);
  const hiddenClass = computed(() => {
    return !isAuthModalOpen.value ? "hidden" : "";
  });

  const globalStore = useGlobalStore();
  const { IsKeydownSpaceEventActive } = storeToRefs(globalStore);
  const { setIsKeydownSpaceEventActive } = globalStore;

  const toggleAuthModal = () => {
    isAuthModalOpen.value = !isAuthModalOpen.value;
    if (IsKeydownSpaceEventActive.value) {
      setIsKeydownSpaceEventActive(false);
    } else {
      setIsKeydownSpaceEventActive(true);
    }
  };

  return {
    isAuthModalOpen,
    hiddenClass,
    toggleAuthModal,
  };
});
