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
    isLoopingSong: false,
    sid: "", // created by howl
    isDifferentSong: false,
    loopedSong: {},
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

      // sid created by howl
      this.sid = this.sound.play();

      // click replay still loop
      if (!this.isDifferentSong && this.loopedSong.loop) {
        this.loopedSong.sid = this.sound.play();
        this.sound.loop(true, this.sid);
      }

      if (this.isDifferentSong) {
        this.loopedSong = {};
      }

      this.sound.on("play", () => {
        requestAnimationFrame(this.progress);
      });

      if (!this.sound.playing) {
        return;
      }
    },
    toggleAudio(song) {
      if (this.isDifferentSong) {
        this.newSong(song);
        this.isDifferentSong = false;
        console.log("play new song");
      } else if (!this.sound.playing() && !this.isDifferentSong) {
        console.log("play same song");
        // this.sound.play();
        this.newSong(song);
        if (this.loopedSong.loop) {
          this.loopedSong.sid = this.sound.play();
          this.sound.loop(true, this.sid);
        }
      } else if (this.sound.playing() && !this.isDifferentSong) {
        console.log("pause same song");
        this.sound.pause();
      }
    },
    watchIsDifferentSong() {
      const songId = this.router.currentRoute._value.params.id;
      if (!songId) {
        return;
      }
      // if (!this.currentSong.sid) {
      //   return;
      // }
      if (songId !== this.currentSong.sid) {
        this.isDifferentSong = true;
      } else {
        this.isDifferentSong = false;
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
      if (!this.sound.playing()) {
        return;
      }
      this.isLoopingSong = !this.isLoopingSong;
      if (this.loopedSong.loop) {
        this.sound.loop(false, this.sid);
        this.loopedSong = {};
        return;
      } else {
        this.loopedSong = {
          sid: this.sid,
          loop: true,
          firebaseSid: this.currentSong.sid,
        };
        this.sound.loop(true, this.sid);
      }
    },
    // onSidChange() {
    //   console.log("sid change");
    // },
    changeLoopingIcon() {
      const thisSongId = this.router.currentRoute._value.params.id;
      if (this.loopedSong.loop && thisSongId === this.loopedSong.firebaseSid) {
        this.isLoopingSong = true;
      }
      this.isLoopingSong = false;
    },
  },
  getters: {
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing();
      }
      return false;
    },
  },
});
