import { defineStore } from "pinia";
import { computed, ref } from "vue";
export const useGlobalStore = defineStore("global", () => {
  const IsKeydownSpaceEventActive = ref(false);
  const setIsKeydownSpaceEventActive = (booleam) => {
    IsKeydownSpaceEventActive.value = booleam;
  };
  const compositionItemShowFormState = ref([]);
  const isCompositionItemShowForm = computed(() => {
    if (compositionItemShowFormState.value.length > 0) {
      return true;
    }
    return false;
  });

  return {
    IsKeydownSpaceEventActive,
    compositionItemShowFormState,
    isCompositionItemShowForm,
    setIsKeydownSpaceEventActive,
  };
});
