import { defineStore } from "pinia";
import { Howl } from "howler";
import helper from "@/includes/helper";
// import { watch, toRef } from "vue";
// import { useRoute } from "vue-router";
import { ref, reactive, computed, watchEffect, watch } from "vue";
import { useRoute } from "vue-router";

export const usePlayerStore = defineStore("player", () => {
  const currentSong = ref({});
  const sound = ref({});
  const seek = ref("00:00");
  const duration = ref("00:00");
  const playerProgress = ref("0%");
  const isLoopingSong = ref(false);
  const sid = ref("");

  const loopedSong = reactive({
    sid: "",
    loop: false,
    firebaseSid: "",
  });
  const isPLayingSong = ref(false);
  const route = useRoute();

  const playing = computed(() => {
    if (sound.value.playing) {
      return sound.value.playing();
    }
    return false;
  });

  const newSong = async (song) => {
    if (sound.value instanceof Howl) {
      sound.value.unload(); // song pause and delete instance from memory
    }
    currentSong.value = song;

    sound.value = new Howl({
      src: [song.url],
      html5: true, // 用於撥放檔案較大的檔案。直接撥放，不等到全部檔案解析完就開始撥放
    });

    // sid created by howl
    sid.value = sound.value.play();

    // click replay still loop
    if (!isDifferentSong.value && loopedSong.loop) {
      loopedSong.sid = sound.value.play();
      sound.value.loop(true, sid);
    }

    if (isDifferentSong.value) {
      loopedSong.sid = "";
      // loopedSong.loop = false;
      loopedSong.firebaseSid = "";
    }

    sound.value.on("play", () => {
      requestAnimationFrame(progress);
    });

    if (!sound.value.playing) {
      return;
    }
  };

  // 須修正在有撥放歌曲的時候進到其他音樂頁面，下方player點選後就會停止撥放
  // 看是否寫一個專屬播放列的function不跟toggle重複
  const toggleAudio = (song) => {
    // 如果目前沒有撥放並且沒有在歌曲頁面的時候就return
    if (!currentSong.value.sid && !route.params.id) {
      return;
    }

    if (!isDifferentSong.value) {
      if (!currentSong.value.sid) {
        newSong(song);
        isPLayingSong.value = true;
      }
    } else if (isDifferentSong.value && route.path !== "/") {
      newSong(song);
    }

    // 新增"新歌是否撥放的state"
    if (currentSong.value.sid) {
      if (sound.value.playing()) {
        sound.value.pause();
      } else {
        sound.value.play();
      }
    }
  };

  // const isDifferentSong = ref(false);
  const isDifferentSong = computed(() => {
    const songId = route.params.id;

    // 在主頁的時候
    if (!songId) {
      return false;
    }
    // 沒有播放時
    if (!currentSong.value.sid) {
      // console.log("detact different song");
      return true;
    }

    // 有歌曲播放時
    if (songId !== currentSong.value.sid) {
      // console.log("detact different song");
      return true;
    } else if (songId === currentSong.value.sid) {
      // console.log("detact same song");
      return false;
    }

    return true;
  });

  const progress = () => {
    seek.value = helper.formatTime(sound.value.seek());
    duration.value = helper.formatTime(sound.value.duration());
    playerProgress.value = `${
      (sound.value.seek() / sound.value.duration()) * 100
    }%`;
    if (sound.value.playing()) {
      requestAnimationFrame(progress);
    }
  };
  const updateSeek = (event) => {
    if (!sound.value.playing) {
      return;
    }
    const { x, width } = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - x;
    const percentage = clickX / width;
    const seconds = sound.value.duration() * percentage;
    sound.value.seek(seconds); // update progress bar position
    sound.value.on("seek", progress); // listen seek event
  };
  const loopSong = () => {
    // 有播放的歌曲，視同首歌時才能loop
    if (!playing.value) {
      return;
    }
    if (loopedSong.loop) {
      console.log("disable loop");
      loopedSong.loop = false;
      sound.value.loop(false, sid.value);
    } else if (sound.value.playing() && !isDifferentSong.value) {
      console.log("enable loop");
      loopedSong.sid = sid.value;
      loopedSong.loop = true;
      loopedSong.firebaseSid = currentSong.value.sid;
      sound.value.loop(true, sid.value);
    }
  };
  const changeLoopingIcon = () => {
    // const thisSongId = this.router.currentRoute._value.params.id;
    const thisSongId = route.params.id;
    if (loopedSong.loop && thisSongId === loopedSong.firebaseSid) {
      isLoopingSong.value = true;
    }
    isLoopingSong.value = false;
  };

  return {
    currentSong,
    sound,
    seek,
    duration,
    playerProgress,
    isLoopingSong,
    sid,
    isDifferentSong,
    loopedSong,
    isPLayingSong,
    playing,
    newSong,
    toggleAudio,
    updateSeek,
    loopSong,
    changeLoopingIcon,
  };
});

// export default defineStore("player", {
//   state: () => ({
//     currentSong: {}, // song info
//     sound: {}, // song instance created by Howl
//     seek: "00:00",
//     duration: "00:00",
//     playerProgress: "0%",
//     isLoopingSong: false,
//     sid: "", // created by howl
//     isDifferentSong: false,
//     loopedSong: {},
//     isPLayingSong: false,
//   }),
//   actions: {
//     async newSong(song) {
//       if (this.sound instanceof Howl) {
//         this.sound.unload(); // song pause and delete instance from memory
//       }
//       this.currentSong = song;

//       this.sound = new Howl({
//         src: [song.url],
//         html5: true, // 用於撥放檔案較大的檔案。直接撥放，不等到全部檔案解析完就開始撥放
//       });

//       // sid created by howl
//       this.sid = this.sound.play();

//       // click replay still loop
//       if (!this.isDifferentSong && this.loopedSong.loop) {
//         this.loopedSong.sid = this.sound.play();
//         this.sound.loop(true, this.sid);
//       }

//       if (this.isDifferentSong) {
//         this.loopedSong = {};
//       }

//       this.sound.on("play", () => {
//         requestAnimationFrame(this.progress);
//       });

//       if (!this.sound.playing) {
//         return;
//       }
//     },
//     toggleAudio(song) {
//       // 當同首歌且沒有歌曲撥放時，點選就會撥放該id的歌
//       // 當同首歌且有歌曲撥放時，點選就會暫停
//       // console.log("clicked");
//       if (!this.isDifferentSong) {
//         if (!this.currentSong.sid) {
//           this.newSong(song);
//           this.isPLayingSong = true;
//         } else {
//           this.sound.pause();
//         }
//       } else {
//         // 當不同首歌的時候，且有歌曲正在撥放，點選就會撥放該id的歌
//         // 當不同首歌時，且沒有歌曲撥放，點選就會撥放
//         if (this.currentSong.sid) {
//           this.sound.pause();
//           return;
//         }
//         this.newSong(song);
//       }

//       // if (this.isDifferentSong) {
//       //   this.newSong(song);
//       //   this.isDifferentSong = false;
//       //   console.log("play new song");
//       // } else if (!this.sound.playing() && !this.isDifferentSong) {
//       //   console.log("play same song");
//       //   // this.sound.play();
//       //   this.newSong(song);
//       //   if (this.loopedSong.loop) {
//       //     this.loopedSong.sid = this.sound.play();
//       //     this.sound.loop(true, this.sid);
//       //   }
//       // } else if (this.sound.playing() && !this.isDifferentSong) {
//       //   console.log("pause same song");
//       //   this.sound.pause();
//       // }
//     },
//     watchIsDifferentSong() {
//       const songId = this.router.currentRoute._value.params.id;

//       // 沒有播放時
//       if (!this.currentSong.sid) {
//         this.isDifferentSong = false;
//         return;
//       }

//       // 有歌曲播放時
//       if (songId !== this.currentSong.sid) {
//         this.isDifferentSong = true;
//       } else {
//         this.isDifferentSong = false;
//       }
//     },
//     progress() {
//       this.seek = helper.formatTime(this.sound.seek());
//       this.duration = helper.formatTime(this.sound.duration());
//       this.playerProgress = `${
//         (this.sound.seek() / this.sound.duration()) * 100
//       }%`;
//       if (this.sound.playing()) {
//         requestAnimationFrame(this.progress);
//       }
//     },
//     updateSeek(event) {
//       if (!this.sound.playing) {
//         return;
//       }
//       const { x, width } = event.currentTarget.getBoundingClientRect();
//       const clickX = event.clientX - x;
//       const percentage = clickX / width;
//       const seconds = this.sound.duration() * percentage;
//       this.sound.seek(seconds); // update progress bar position
//       this.sound.on("seek", this.progress); // listen seek event
//     },
//     loopSong() {
//       if (!this.sound.playing()) {
//         return;
//       }
//       this.isLoopingSong = !this.isLoopingSong;
//       if (this.loopedSong.loop) {
//         this.sound.loop(false, this.sid);
//         this.loopedSong = {};
//         return;
//       } else {
//         this.loopedSong = {
//           sid: this.sid,
//           loop: true,
//           firebaseSid: this.currentSong.sid,
//         };
//         this.sound.loop(true, this.sid);
//       }
//     },
//     // onSidChange() {
//     //   console.log("sid change");
//     // },
//     changeLoopingIcon() {
//       const thisSongId = this.router.currentRoute._value.params.id;
//       if (this.loopedSong.loop && thisSongId === this.loopedSong.firebaseSid) {
//         this.isLoopingSong = true;
//       }
//       this.isLoopingSong = false;
//     },
//   },
//   getters: {
//     playing: (state) => {
//       if (state.sound.playing) {
//         return state.sound.playing();
//       }
//       return false;
//     },
//   },
// });
