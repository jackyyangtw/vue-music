<template>
  <!-- Composition Items -->
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modifiedName }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click="openComfirmModal(song, index)"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click="showForm = !showForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
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
      >
        <div class="mb-3">
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
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="isSubmission"
        >
          Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          :disabled="isSubmission"
          @click.prevent="(showForm = false), (showAlert = false)"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { ErrorMessage } from "vee-validate";
import { songsCollection, storage } from "../includes/firebase";
import useModalStore from "@/stores/modal";
import { mapActions } from "pinia";
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
    removeSongData: {
      type: Function,
      required: true,
    },
    updateUnsavedFlag: {
      type: Function,
    },
  },
  data() {
    return {
      showForm: false,
      schema: {
        modifiedName: "required",
        genre: "alpha_spaces",
      },
      isSubmission: false,
      showAlert: false,
      alertVariant: "bg-blue-500",
      alertMessage: "Please wait ! Updating song info...",
    };
  },
  methods: {
    ...mapActions(useModalStore, ["openComfirmModal"]),
    async editForm(values) {
      console.log(values);
      this.isSubmission = true;
      this.showAlert = true;

      try {
        await songsCollection.doc(this.song.docID).update(values);
      } catch (err) {
        this.isSubmission = false;
        this.alertVariant = "bg-red-500";
        this.alertMessage = "Something went wrong! Try again later";
        console.log(err);
        return;
      }
      this.updateUnsavedFlag(false);
      this.updateSong(this.index, values);
      this.isSubmission = false;
      this.alertVariant = "bg-green-500";
      this.alertMessage = "Success!";
    },
    async deleteSong() {
      // delete storage file
      const storeRef = storage.ref();
      const songRef = storeRef.child(`song/${this.song.originialName}`);
      await songRef.delete();

      // delete data
      await songsCollection.doc(this.song.docID).delete();
      this.removeSongData(this.index);
    },
  },
};
</script>
