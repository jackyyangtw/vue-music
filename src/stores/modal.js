import { defineStore } from "pinia";

export default defineStore("modal", {
  state: () => ({
    isOpen: false,
    isComfirmModalOpen: false,
    song: {},
    index: "",
  }),
  actions: {
    toggleModal() {
      this.isOpen = !this.isOpen;
    },
    closeComfirmModal() {
      this.isComfirmModalOpen = false;
    },
    openComfirmModal(song, index) {
      this.isComfirmModalOpen = true;
      this.song = song;
      this.index = index;
    },
  },
  getters: {
    hiddenClass(state) {
      return !state.isOpen ? "hidden" : "";
    },
  },
});
