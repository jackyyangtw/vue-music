<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          @click.prevent="playerStore.toggleAudio(song)"
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
        >
          <i
            class="fas"
            :class="{
              'fa-play': playerStore.isDifferentSong || !playerStore.playing,
              'fa-pause': playerStore.playing,
            }"
          ></i>
        </button>

        <div class="z-50 text-left ml-8 mr-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modifiedName }}</div>
          <div>{{ song.genre }}</div>
          <!-- n => number -->
          <!-- $n(price,translation,locale) -->
          <div class="song-price">{{ $n(100000, "currency", "ja") }}</div>
        </div>
        <button
          @click.prevent="newSong(song)"
          type="button"
          class="z-50 h-12 w-12 text-xl bg-white text-black rounded focus:outline-none"
        >
          <i class="fas fa-redo-alt"></i>
        </button>
        <button
          @click.prevent="loopSong"
          type="button"
          class="z-50 h-12 w-12 text-xl bg-white text-black rounded focus:outline-none"
          :class="{ 'text-red-500': playerStore.isLoopingSong }"
        >
          <i class="fas fa-recycle"></i>
        </button>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title"
            >{{
              $tc("song.commentCount", song.commentCount, {
                count: song.commentCount,
              })
            }}
          </span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div
            class="text-white text-center font-bold p-4 mb-4"
            v-show="commentShowAlert"
            :class="commentAlertVariant"
          >
            {{ commentAlertMessage }}
          </div>
          <vee-form
            :validation-schema="schema"
            @submit="addComment"
            v-if="userStore.userLoggedIn"
          >
            <vee-field
              as="textarea"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
              name="comment"
            ></vee-field>
            <ErrorMessage class="text-red-500" name="comment" />
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
              :disabled="commentInSubmission"
            >
              Submit
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <select
            v-model="sort"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <li
        class="p-6 bg-gray-50 border border-gray-200"
        v-for="comment in sortedComments"
        :key="comment.docID"
      >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ comment.datePosted }}</time>
        </div>

        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script>
import { songsCollection, commentCollection, auth } from "../includes/firebase";
import { usePlayerStore } from "../stores/player";
import { useUserStore } from "../stores/user";
import { ref, reactive, computed, watch, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
export default {
  setup() {
    const playerStore = usePlayerStore();
    const userStore = useUserStore();
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
      commentAlertMessage: "Please wait! Your comment is being submitted...",
    });

    const sortedComments = computed(() => {
      return comments.value.slice().sort((a, b) => {
        if (sort.value === "1") {
          // date string ex: Thu Nov 03 2022 08:28:21 GMT+0800 (台北標準時間)
          // console.log(new Date(b.datePosted));
          return new Date(b.datePosted) - new Date(a.datePosted); // new -> old，降冪
        }
        return new Date(a.datePosted) - new Date(b.datePosted); // old -> new
      });
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

    const addComment = async (values, { resetForm }) => {
      commentState.commentInSubmission = true;
      commentState.commentShowAlert = true;
      commentState.commentAlertVariant = "bg-blue-500";
      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        sid: route.params.id,
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid, // user更改評論的時候會用到
      };
      await commentCollection.add(comment);

      song.value.commentCount += 1;
      await songsCollection.doc(route.params.id).update({
        commentCount: song.value.commentCount,
      });

      getComments();
      commentState.commentInSubmission = false;
      commentState.commentAlertVariant = "bg-green-500";
      commentState.commentAlertMessage = "comment added!";

      resetForm(); // context.resetForm
    };

    const getComments = async () => {
      const snapshots = await commentCollection
        .where("sid", "==", route.params.id)
        .get();

      comments.value = []; // 確保不會有重複的comment

      snapshots.forEach((doc) => {
        comments.value.push({
          docID: doc.id,
          ...doc.data(),
        });
      });
    };

    return {
      song,
      comments,
      sort,
      schema,
      sortedComments,
      playerStore,
      userStore,
      ...toRefs(commentState),
      addComment,
      getComments,
    };
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
      console.log("set new song");
      vm.getComments();
      console.log("route change!");
      playerStore.changeLoopingIcon();
    });
  },
};
</script>

<style lang="scss" scoped></style>
