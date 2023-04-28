<template>
  <main>
    <!-- Music Header -->
    <section
      class="w-full mb-8 py-14 px-3 xl:px-0 text-center text-white relative"
    >
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex flex-wrap items-center">
        <!-- Play/Pause Button -->
        <button
          @click.prevent="playerStore.toggleAudio(song)"
          type="button"
          class="hidden lg:block z-10 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
        >
          <i
            class="fas"
            :class="{
              'fa-play': playerStore.isDifferentSong || !playerStore.playing,
              'fa-pause': playerStore.playing,
            }"
          ></i>
        </button>
        <div class="z-10 text-left lg:ml-8 lg:mr-8">
          <!-- Song Info -->
          <div class="text-2xl lg:text-3xl font-bold">
            {{ song.modifiedName }}
          </div>
          <div>{{ song.genre }}</div>
          <!-- n => number -->
          <!-- $n(price,translation,locale) -->
          <!-- <div class="song-price">{{ $n(100000, "currency", "ja") }}</div> -->
        </div>
        <div class="flex w-full lg:w-auto justify-between items-center mt-5">
          <button
            @click.prevent="playerStore.toggleAudio(song)"
            type="button"
            class="lg:hidden z-10 h-20 mr-5 w-20 text-3xl bg-white text-black rounded-full focus:outline-none"
          >
            <i
              class="fas"
              :class="{
                'fa-play': playerStore.isDifferentSong || !playerStore.playing,
                'fa-pause': playerStore.playing,
              }"
            ></i>
          </button>
          <div class="z-10">
            <button
              @click.prevent="playerStore.replaySong(song)"
              v-if="showFunctionIcons"
              type="button"
              class="h-12 w-12 text-xl bg-white text-black rounded focus:outline-none mr-3"
            >
              <i class="fas fa-redo-alt"></i>
            </button>
            <button
              @click.prevent="playerStore.loopSong"
              v-if="showFunctionIcons"
              type="button"
              class="h-12 w-12 text-xl bg-white rounded focus:outline-none"
              :class="{
                'text-red-500': playerStore.loopedSong.loop,
                'text-black': !playerStore.loopedSong.loop,
              }"
            >
              <i class="fas fa-recycle"></i>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- content & form -->
    <section class="container mx-auto mt-6" id="comments">
      <div class="rounded relative flex flex-col mx-3 lg:mx-0">
        <div
          class="pt-6 pb-5 font-bold text-white flex justify-between items-center"
        >
          <div class="flex justify-center items-center">
            <i
              class="fa fa-comments float-right text-green-400 text-2xl mr-3"
            ></i>
            <!-- Comment Count -->
            <span
              >{{
                t("song.commentCount", song.commentCount, {
                  count: song.commentCount,
                })
              }}
            </span>
          </div>

          <!-- Sort Comments -->
          <select
            v-if="song.commentCount > 0"
            v-model="sort"
            class="block py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="1">{{ $t("song.latest") }}</option>
            <option value="2">{{ $t("song.oldest") }}</option>
          </select>
        </div>
        <!-- login button -->
        <div
          class="bg-gray-700 rounded py-10 flex justify-center items-center"
          v-if="!userLoggedIn"
        >
          <div
            v-cloak
            @click="toggleModal"
            class="cursor-pointer text-white-700 transition bg-green-400 hover:bg-green-500 max-w-xs text-center inline-block rounded py-3 px-3"
          >
            {{ $t("song.login_btn") }}
          </div>
        </div>
        <div>
          <!-- Form -->
          <vee-form
            :validation-schema="schema"
            @submit="addComment"
            v-if="userStore.userLoggedIn"
          >
            <vee-field name="comment" v-slot="{ field }">
              <textarea
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
                :placeholder="$t('song.textarea_placeholder')"
                v-bind="field"
                @focus="changeState($event)"
                @blur="changeState($event)"
              />
            </vee-field>
            <ErrorMessage class="text-red-500" name="comment" />
            <div class="flex">
              <button
                type="submit"
                class="p-4 rounded text-white bg-green-600 mr-3 min-w-[100px] block"
                :disabled="commentInSubmission"
              >
                {{ $t("common.submit") }}
              </button>
              <div
                class="text-white text-center font-bold p-4 inline-block transition-all"
                v-show="commentShowAlert"
                :class="[commentAlertVariant, { 'opacity-0': !showMessage }]"
              >
                {{ commentAlertMessage }}
              </div>
            </div>
          </vee-form>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <div class="mx-3 lg:mx-0">
      <ul
        class="container mx-auto py-3 mt-5 m-5 rounded"
        v-if="comments.length > 0"
      >
        <li
          class="text-white mb-5"
          v-for="comment in sortedComments"
          :key="comment.docID"
        >
          <!-- Comment Author -->
          <div class="mb-1">
            <div class="font-extrabold">
              <span class="text-sm">{{ comment.name }}</span
              ><time class="text-neutral-400 ml-2 text-xs"
                >{{ $filters.timeAgo(comment.datePosted) }}
              </time>
            </div>
          </div>
          <p>
            {{ comment.content }}
          </p>
        </li>
      </ul>
    </div>
  </main>
</template>

<script>
import { songsCollection, commentCollection, auth } from "../includes/firebase";
import { usePlayerStore } from "../stores/player";
import { useUserStore } from "../stores/user";
import { useModalStore } from "../stores/modal";
import { useGlobalStore } from "../stores/global";
import { ref, reactive, computed, watch, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { useSongStore } from "../stores/song";
export default {
  setup() {
    const { t } = useI18n();
    const playerStore = usePlayerStore();
    const userStore = useUserStore();
    const { userLoggedIn } = storeToRefs(userStore);
    const modalstore = useModalStore();
    const { toggleModal } = modalstore;

    const route = useRoute();
    const router = useRouter();

    const song = ref({});
    const comments = ref([]);
    const sort = ref("1");
    const schema = reactive({
      comment: "required|min:3",
    });
    const commentState = reactive({
      commentInSubmission: false,
      commentShowAlert: false,
      commentAlertVariant: "bg-blue-500",
      commentAlertMessage: t("app_state.adding_comment"),
    });

    const sortedComments = computed(() => {
      return comments.value.slice().sort((a, b) => {
        if (sort.value === "1") {
          // date string ex: Thu Nov 03 2022 08:28:21 GMT+0800 (台北標準時間)
          return new Date(b.datePosted) - new Date(a.datePosted); // new -> old，降冪
        }
        return new Date(a.datePosted) - new Date(b.datePosted); // old -> new
      });
    });

    const showFunctionIcons = computed(() => {
      if (
        playerStore.currentSong.sid &&
        playerStore.currentSong.sid === route.params.id
      ) {
        return true;
      }
      return false;
    });

    watch(sort, (newVal) => {
      if (newVal === route.query.sort) {
        return;
      }
      router.push({
        query: {
          sort: newVal,
        },
      });
    });

    const songStore = useSongStore();
    const { getAllSongs } = songStore;
    const showMessage = ref(true);
    const addComment = async (values, { resetForm }) => {
      showMessage.value = true;
      commentState.commentAlertMessage = t("app_state.adding_comment");
      commentState.commentInSubmission = true;
      commentState.commentShowAlert = true;
      commentState.commentAlertVariant = "bg-blue-500";
      const comment = {
        content: values.comment,
        datePosted: new Date().toISOString(),
        sid: route.params.id,
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid, // user更改評論的時候會用到
      };
      await commentCollection.add(comment);

      song.value.commentCount += 1;
      await songsCollection.doc(route.params.id).update({
        commentCount: song.value.commentCount,
      });

      getAllSongs();

      getComments();
      commentState.commentInSubmission = false;
      commentState.commentAlertVariant = "bg-green-500";
      commentState.commentAlertMessage = t("app_state.add_comment_success");

      setTimeout(() => {
        showMessage.value = false;
      }, 3000);

      resetForm(); // context.resetForm
    };

    const getComments = async (sid) => {
      const snapshots = await commentCollection
        .where("sid", "==", sid || route.params.id)
        .get();

      comments.value = []; // 確保不會有重複的comment

      snapshots.forEach((doc) => {
        comments.value.push({
          docID: doc.id,
          ...doc.data(),
        });
      });
    };

    const globalStore = useGlobalStore();
    const { IsKeydownSpaceEventActive } = storeToRefs(globalStore);
    const changeState = (e) => {
      if (e.type === "focus") {
        IsKeydownSpaceEventActive.value = true;
      } else if (e.type === "blur") {
        IsKeydownSpaceEventActive.value = false;
      }
    };

    return {
      song,
      comments,
      sort,
      schema,
      sortedComments,
      playerStore,
      userStore,
      showFunctionIcons,
      userLoggedIn,
      ...toRefs(commentState),
      addComment,
      getComments,
      toggleModal,
      changeState,
      showMessage,
      t,
    };
  },
  async beforeRouteUpdate(to) {
    const playerStore = usePlayerStore();
    try {
      const docSnapshot = await songsCollection.doc(to.params.id).get();
      if (!docSnapshot.exists) {
        this.$router.push({ name: "home" });
        return;
      }

      const { sort } = this.$route.query;
      this.sort = sort === "1" || sort === "2" ? sort : "1"; // 確保sort 是有效的值才 assign 否則sort by default(new to old)

      this.song = docSnapshot.data();
      this.song.sid = to.params.id;
      await this.getComments(to.params.id);
      playerStore.changeLoopingIcon();
    } catch (err) {
      console.log(err);
    }
  },
  async beforeRouteEnter(to, from, next) {
    const docSnapshot = await songsCollection.doc(to.params.id).get();
    const playerStore = usePlayerStore();

    next((vm) => {
      if (!docSnapshot.exists) {
        vm.$router.push({ name: "home" });
        return;
      }

      const { sort } = vm.$route.query;
      vm.sort = sort === "1" || sort === "2" ? sort : "1"; // 確保sort 是有效的值才 assign 否則sort by default(new to old)

      vm.song = docSnapshot.data();
      vm.song.sid = to.params.id;
      vm.getComments();
      playerStore.changeLoopingIcon();
    });
  },
};
</script>

<style>
[v-cloak] {
  display: none;
}
</style>
