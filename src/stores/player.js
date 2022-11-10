import { defineStore } from "pinia";
import { Howl } from "howler";
import helper from "@/includes/helper";
// import { watch, toRef } from "vue";
// import { useRoute } from "vue-router";
export default defineStore("player", {
  state: () => ({
    currentSong: {}, // song info
    sound: {}, // song instance created by Howl
    seek: "00:00",
    duration: "00:00",
    playerProgress: "0%",
    loop: false,
    sid: "",
  }),
  actions: {
    async newSong(song) {
      if (this.sound instanceof Howl) {
        this.sound.unload(); // song pause and delete instance from memory
      }
      this.currentSong = song;
      this.sound = new Howl({
        src: [song.url],
        html5: true, // 用於撥放檔案較大的檔案。直接撥放，不等到全部檔案解析完就開始撥放
      });

      this.sid = this.sound.play();

      this.sound.on("play", () => {
        requestAnimationFrame(this.progress);
      });
      if (!this.sound.playing) {
        return;
      }
    },
    async toggleAudio(song) {
      // if (!this.sound.playing) {
      //   return;
      // }

      console.log(this.isDifferentSong);
      // this.newSong(song);
      if (
        (this.isDifferentSong && !this.sound.playing) ||
        (this.isDifferentSong && this.sound.playing)
      ) {
        this.newSong(song);
      } else if (!this.sound.playing() && !this.isDifferentSong) {
        console.log("play same song");
        this.sound.play();
      } else if (this.sound.playing() && !this.isDifferentSong) {
        console.log("pause same song");
        this.sound.pause();
      }
    },
    progress() {
      this.seek = helper.formatTime(this.sound.seek());
      this.duration = helper.formatTime(this.sound.duration());
      this.playerProgress = `${
        (this.sound.seek() / this.sound.duration()) * 100
      }%`;
      if (this.sound.playing()) {
        requestAnimationFrame(this.progress);
      }
    },
    updateSeek(event) {
      if (!this.sound.playing) {
        return;
      }
      const { x, width } = event.currentTarget.getBoundingClientRect();
      const clickX = event.clientX - x;
      const percentage = clickX / width;
      const seconds = this.sound.duration() * percentage;
      this.sound.seek(seconds); // update progress bar position
      this.sound.on("seek", this.progress); // listen seek event
    },
    loopSong() {
      this.loop = !this.loop;
      this.sound.loop(this.loop, this.sid);
    },
    onSidChange() {
      console.log("sid change");
    },
  },
  getters: {
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing();
      }
      return false;
    },
    isDifferentSong() {
      const songId = this.router.currentRoute._value.params.id;
      if (songId !== this.currentSong.sid) {
        return true;
      }
      return false;
    },
  },
});
