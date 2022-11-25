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

      this.sid = this.sound.play();

      this.sound.on("play", () => {
        requestAnimationFrame(this.progress);
      });
      if (!this.sound.playing) {
        return;
      }
    },
    toggleAudio(song) {
      // if (!this.sound.playing) {
      //   return;
      // }
      // const songId = this.router.currentRoute._value.params.id;

      // console.log(this.isDifferentSong);
      // this.newSong(song);
      if (this.isDifferentSong) {
        this.newSong(song);
        this.isDifferentSong = false;
        console.log("play new song");
      } else if (!this.sound.playing() && !this.isDifferentSong) {
        console.log("play same song");
        this.sound.play();
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
      const thisSongId = this.router.currentRoute._value.params.id;
      // const loopedSong = this.loopSongs.find((song) => {
      //   return song.sid === thisSongId;
      // });

      // 如果是同一首歌，並且該首歌沒有loop，該首歌變成loop
      // 如果是同首歌，該首歌有loop，該首歌取消loop

      if (!this.isDifferentSong && !this.loopedSong) {
        this.loopedSong = { sid: thisSongId, loop: true };
        this.sound.loop(true, thisSongId);

        // loopedSong.loop = !loopedSong.loop;
        // this.sound.loop(true, loopedSong.sid);

        // check loopSongs data 是否存在
        // const loopedSong = this.loopSongs.find((song) => {
        //   return song.sid === thisSongId;
        // });
        // console.log(loopedSong);

        // if (loopedSong) {
        //   return;
        // }
        // this.loopSongs.push({
        //   sid: thisSongId,
        //   loop: true,
        // });
      } else if (!this.isDifferentSong && this.loopedSong.loop) {
        this.loopedSong = null;
        this.sound.loop(false, thisSongId);
        // this.sound.loop(false, this.sid);
        // // 刪除 loop song data
        // this.loopSongs.filter((song) => {
        //   return song.sid !== thisSongId;
        // });
      } else if (this.isDifferentSong && !this.loopedSong) {
      }
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
    // isDifferentSong() {
    //   const songId = this.router.currentRoute._value.params.id;
    //   if (songId !== this.currentSong.sid) {
    //     return true;
    //   }
    //   return false;
    // },
  },
});
