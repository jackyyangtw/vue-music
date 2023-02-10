import { defineStore } from "pinia";
import { ref } from "vue";
export const useGlobalStore = defineStore("global", () => {
  const IsKeydownSpaceEventActive = ref(false);
  const setIsKeydownSpaceEventActive = (booleam) => {
    IsKeydownSpaceEventActive.value = booleam;
  };
  return {
    IsKeydownSpaceEventActive,
    setIsKeydownSpaceEventActive,
  };
});
