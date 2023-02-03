<template>
  <teleport to="body">
    <transition name="fadeUp">
      <div
        v-show="isModalOpen"
        class="flex items-center justify-center pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <!-- backdrop -->
        <div class="fixed inset-0 transition-opacity" @click="closeModal">
          <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
        </div>
        <div
          class="content fixed-center inline-block align-bottom bg-white text-left overflow-hidden shadow-xl transition-all p-5 rounded-lg sm:my-8 sm:align-middle sm:max-w-lg w-[80%]"
        >
          <slot></slot>
          <!-- buttons -->
          <div v-if="!isForm" class="flex justify-end items-center pb-4">
            <!-- left -->
            <BaseButton
              @click="closeModal"
              :type="button"
              class="mr-5"
              :blue="true"
              v-if="showButton"
              >Cancel</BaseButton
            >
            <!-- right -->
            <BaseButton
              red="true"
              type="button"
              @click="successHandler"
              v-if="showButton"
              >Delete</BaseButton
            >
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
export default {
  // props: ["isModalOpen", "isForm", "successHandler"],
  props: {
    isModalOpen: {
      type: Boolean,
    },
    isForm: {
      type: Boolean,
      default: false,
    },
    successHandler: {
      type: Function,
    },
    showButton: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["closeModal"],
  methods: {
    closeModal() {
      this.$emit("closeModal", false);
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
