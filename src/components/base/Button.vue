<template>
  <button
    :type="type"
    class="cursor-pointer p-3 rounded text-white"
    :class="[blueBtn, redBtn]"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: ["type", "classes", "blue", "red"],
  computed: {
    blueBtn() {
      return this.blue ? "bg-blue-500 hover:bg-blue-400" : this.classes;
    },
    redBtn() {
      return this.red ? "bg-red-500 hover:bg-red-400" : this.classes;
    },
  },
};
</script>
