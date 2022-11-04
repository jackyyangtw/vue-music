export default {
  formatTime(time) {
    const minutes = Math.floor(time / 60) || 0;
    const secounds = Math.round(time - minutes * 60 || 0);

    return `${minutes}:${secounds < 10 ? "0" : ""}${secounds}`;
  },
};
