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
      <BaseModal>
        <div class="text-2xl font-bold pb-5" v-if="!isDeleting">
          <svg
            aria-hidden="true"
            class="mx-auto mb-4 w-20 h-20 text-gray-400 dark:text-black-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div class="pb-3">{{ $t("confirm_modal.info") }}</div>
          <div class="text-green-500 italic pb-3">
            {{ song.modifiedName }}
          </div>
        </div>
        <div class="text-2xl font-bold text-center" v-else>
          {{ $t("confirm_modal.deleting_info") }}
        </div>

        <!-- buttons -->
        <div class="flex justify-end items-center pb-4" v-if="!isDeleting">
          <div
            class="cursor-pointer bg-blue-500 hover:bg-blue-400 p-3 rounded text-white mr-5"
          >
            <button @click="closeComfirmModal">
              {{ $t("confirm_modal.cancel") }}
            </button>
          </div>
          <div
            class="cursor-pointer bg-red-500 text-white p-3 rounded hover:bg-red-400"
            @click="deleteSong"
          >
            {{ $t("confirm_modal.delete") }}
          </div>
        </div>
      </BaseModal>
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
          <label class="inline-block mb-2">{{ $t("manage.song_title") }}</label>
          <vee-field
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            name="modifiedName"
            autocomplete="modifiedName"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="modifiedName"></ErrorMessage>
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">{{ $t("manage.genre") }}</label>
          <vee-field
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            :placeholder="$t('input_field.genre_placeholder')"
            name="genre"
            autocomplete="genre"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="genre"></ErrorMessage>
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 mr-3 rounded text-white bg-green-600"
          :disabled="isSubmission"
        >
          {{ $t("input_field.submit") }}
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          :disabled="isSubmission"
          @click.prevent="toggleForm"
        >
          {{ $t("manage.back") }}
        </button>
      </vee-form>
    </div>
  </div>
  <BaseModal></BaseModal>
</template>

<script>
import { ErrorMessage } from "vee-validate";
import { songsCollection } from "../includes/firebase";
import { useModalStore } from "@/stores/modal";
import { useSongStore } from "../stores/song";
import { useGlobalStore } from "../stores/global";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";

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
    const { t } = useI18n();
    const showForm = ref(false);
    const schema = {
      modifiedName: { required: true, not_same_value: props.song.modifiedName },
      genre: "alpha_spaces",
    };
    const isSubmission = ref(false);
    const showAlert = ref(false);
    const alertVariant = ref("bg-blue-500");
    const alertMessage = ref(t("app_state.changing_song_info"));
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

    // 新增: 如果有資料變更，songStore / showFetchedSongs = true
    // 如果資料沒變 return
    const songStore = useSongStore();
    const { showFetchedSongs } = storeToRefs(songStore);
    const { updateSingleStoreSong } = songStore;
    const editForm = async (values) => {
      isSubmission.value = true;
      showAlert.value = true;

      try {
        await songsCollection.doc(props.song.docID).update(values);
      } catch (err) {
        isSubmission.value = false;
        alertVariant.value = "bg-red-500";
        alertMessage.value = t("app_state.error_happened");
        return;
      }
      props.updateUnsavedFlag(false);
      props.updateSong(props.index, values);
      updateSingleStoreSong(props.song.docID, values);
      showFetchedSongs.value = false;
      isSubmission.value = false;
      alertVariant.value = "bg-green-500";
      alertMessage.value = t("app_state.success");
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
