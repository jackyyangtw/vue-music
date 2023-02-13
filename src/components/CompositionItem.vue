<template>
  <!-- Composition Items -->
  <div class="p-3 mb-4 rounded hover:bg-white/[0.1] transition">
    <div class="flex justify-between" v-show="!showForm">
      <router-link
        :to="{ name: 'song', params: { id: song.docID } }"
        class="block text-white text-l md:text-xl xl:text-2xl font-bold w-[60%]"
      >
        {{ song.modifiedName }}
      </router-link>
      <div class="flex justify-center items-center">
        <button
          class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 w-8 h-8"
          @click="openComfirmModal(song, index)"
        >
          <i class="fa fa-times"></i>
        </button>
        <button
          class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 w-8 h-8"
          @click="toggleForm"
        >
          <i class="fa fa-pencil-alt"></i>
        </button>
      </div>
    </div>
    <div v-show="showForm">
      <div
        class="text-white text-center font-bold p-4 mb-4"
        :class="alertVariant"
        v-if="showAlert"
      >
        {{ alertMessage }}
      </div>
      <vee-form
        @submit="editForm"
        :validation-schema="schema"
        :initial-values="song"
        class="text-white"
      >
        <div class="mb-3 text-white">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            name="modifiedName"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="modifiedName"></ErrorMessage>
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            name="genre"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="genre"></ErrorMessage>
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 mr-3 rounded text-white bg-green-600"
          :disabled="isSubmission"
        >
          Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          :disabled="isSubmission"
          @click.prevent="toggleForm"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { ErrorMessage } from "vee-validate";
import { songsCollection } from "../includes/firebase";
import { useModalStore } from "@/stores/modal";
import { useSongStore } from "../stores/song";
import { useGlobalStore } from "../stores/global";
import { ref } from "vue";
import { storeToRefs } from "pinia";

export default {
  name: "CompositionItem",
  components: { ErrorMessage },
  props: {
    song: {
      type: Object,
      required: true,
    },
    updateSong: {
      type: Function,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    updateUnsavedFlag: {
      type: Function,
    },
  },
  setup(props) {
    const showForm = ref(false);
    const schema = {
      modifiedName: "required",
      genre: "alpha_spaces",
    };
    const isSubmission = ref(false);
    const showAlert = ref(false);
    const alertVariant = ref("bg-blue-500");
    const alertMessage = ref("Please wait ! Updating song info...");
    const modalStore = useModalStore();
    const { openComfirmModal } = modalStore;

    const gloalStore = useGlobalStore();
    const { compositionItemShowFormState } = storeToRefs(gloalStore);
    const toggleForm = () => {
      showForm.value = !showForm.value;
      if (showForm.value) {
        compositionItemShowFormState.value.push({
          showForm: true,
          id: props.song.docID,
        });
      } else {
        compositionItemShowFormState.value =
          compositionItemShowFormState.value.filter(
            (state) => state.id !== props.song.docID
          );
      }
    };

    // 新增: 如果有資料變更，songStore / needToFetchAllsong = true
    // 如果資料沒變 return
    const songStore = useSongStore();
    const { needToFetchAllsong } = storeToRefs(songStore);
    const { updateSingleStoreSong } = songStore;
    const editForm = async (values) => {
      console.log(values);
      isSubmission.value = true;
      showAlert.value = true;

      try {
        await songsCollection.doc(props.song.docID).update(values);
      } catch (err) {
        isSubmission.value = false;
        alertVariant.value = "bg-red-500";
        alertMessage.value = "Something went wrong! Try again later";
        return;
      }
      props.updateUnsavedFlag(false);
      props.updateSong(props.index, values);
      updateSingleStoreSong(props.song.docID, values);
      needToFetchAllsong.value = true;
      isSubmission.value = false;
      alertVariant.value = "bg-green-500";
      alertMessage.value = "Success!";
    };
    return {
      showForm,
      schema,
      isSubmission,
      showAlert,
      alertVariant,
      alertMessage,
      openComfirmModal,
      editForm,
      toggleForm,
    };
  },
};
</script>
