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

    // 暫停、撥放切換
    if (currentSong.value.sid) {
      if (sound.value.playing()) {
        sound.value.pause();
      } else {
        sound.value.play();
      }
    }

    // if (!currentSong.value.sid) {
    //   newSong(song);
    // }

    // 如果目前沒有撥放的音樂、並且是不同首歌就撥放
    // 如果目前有撥放的音樂，並且是不同首歌就撥放
    // if (!isDifferentSong.value) {
    //   if (!currentSong.value.sid) {
    //     console.log("同首歌，並且沒有歌曲撥放");
    //     newSong(song);
    //     isPLayingSong.value = true;
    //   }
    // } else if (isDifferentSong.value && route.path !== "/") {
    //   console.log("不同首歌並且不在主頁");
    //   newSong(song);
    // }
    if (isDifferentSong.value && route.path !== "/") {
      console.log("不同首歌並且不在主頁");
      newSong(song);
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
    playing,
    newSong,
    toggleAudio,
    updateSeek,
    loopSong,
    changeLoopingIcon,
  };
});
