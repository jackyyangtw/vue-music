<template>
  <teleport to="body">
    <transition name="fadeUp" @after-leave="isDeleting = false">
      <div
        v-show="isModalOpen"
        class="flex items-center justify-center pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <!-- backdrop -->
        <div class="fixed inset-0 transition-opacity" @click="closeModal">
          <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
        </div>
        <!-- content -->
        <div
          class="content ab-center inline-block align-bottom bg-white text-left overflow-hidden shadow-xl transition-all p-5 rounded-lg sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <slot></slot>

          <!-- buttons -->
          <div class="flex justify-end items-center pb-4">
            <div
              class="cursor-pointer p-3 rounded text-white mr-5"
              :class="
                buttonLeft.classes
                  ? buttonLeft.classes
                  : 'bg-blue-500 hover:bg-blue-400'
              "
            >
              <button @click="closeModal">
                {{ buttonLeft.title }}
              </button>
            </div>
            <div
              class="cursor-pointer text-white p-3 rounded"
              :class="
                buttonRight.classes
                  ? buttonLeft.classes
                  : 'bg-red-500 hover:bg-red-400'
              "
            >
              <button @click="successHadnler">
                {{ buttonRight.title }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
// import useModalStore from "@/stores/modal";
// import { mapState } from "pinia";
export default {
  props: ["isModalOpen", "buttonLeft", "buttonRight", "successHadnler"],
  emits: ["closeModal"],
  methods: {
    closeModal() {
      this.$emit("closeModal", false);
    },
  },
  // computed: {
  //   ...mapState(useModalStore, ["isComfirmModalOpen", "song", "index"]),
  // },
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
