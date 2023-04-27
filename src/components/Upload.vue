<template>
  <div class="rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">{{ $t("manage.upload") }}</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="hidden lg:block w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': isDragover }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="isDragover = false"
        @dragover.prevent.stop="isDragover = true"
        @dragenter.prevent.stop="isDragover = true"
        @dragleave.prevent.stop="isDragover = false"
        @drop.prevent.stop="uploadFile($event)"
      >
        <h5>{{ $t("manage.drop_file") }}</h5>
      </div>
      <div class="text-center">
        <label
          class="text-white inline-block mt-3 border px-5 py-1 rounded hover:bg-white hover:text-gray-800 cursor-pointer transition mx-auto"
          for="file"
          >{{ $t("manage.upload") }}</label
        >
        <input
          class="hidden"
          id="file"
          type="file"
          mutiple
          @change="uploadFile($event)"
        />
      </div>
      <hr class="my-6" />
      <!-- Progess Bars -->
      <!-- 消失的時候會有fadeout效果 -->
      <transition-group name="fade" tag="div">
        <div
          class="mb-4"
          v-for="upload in uploads"
          :key="upload.name"
          @click="cancelUpload(upload)"
        >
          <!-- File Name -->
          <!-- 右邊加上X，讓使用者刪除progress bar -->
          <div class="flex justify-between">
            <div class="font-bold text-sm text-white" :class="upload.textClass">
              <i
                @click="cancelUpload(upload)"
                class="mr-2"
                :class="upload.icon"
              ></i
              >{{ upload.name }}
            </div>
            <!-- delete icon -->
            <div class="text-white text-red-500 cursor-pointer">
              <i class="fas fa-times"></i>
            </div>
          </div>
          <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
            <!-- Inner Progress Bar -->
            <div
              class="transition-all progress-bar"
              :class="upload.variant"
              :style="{ width: upload.currentProgress + '%' }"
            ></div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { storage, auth, songsCollection } from "@/includes/firebase";
import { onBeforeUnmount, ref } from "vue";
import { useSongStore } from "../stores/song";
import { storeToRefs } from "pinia";
export default {
  props: ["addSong"],
  setup(props) {
    const isDragover = ref(false);
    const uploads = ref([]);

    const songStore = useSongStore();
    const { showFetchedSongs } = storeToRefs(songStore);
    const { getAllSongs } = songStore;

    onBeforeUnmount(() => {
      uploads.value.forEach((upload) => {
        upload.task.cancel();
      });
    });

    const uploadFile = (e) => {
      isDragover.value = false;

      const files = e.dataTransfer
        ? [...e.dataTransfer.files] // for drag
        : [...e.target.files]; // for input

      files.forEach((file) => {
        if (file.type !== "audio/mpeg") {
          console.log("please upload song file");
          return;
        }

        // 如果ofline就無法上傳檔案
        if (!navigator.onLine) {
          uploads.value.push({
            task: {},
            currentProgress: 100,
            name: file.name,
            variant: "bg-red-400",
            icon: "fas fa-times",
            textClass: "text-red-400",
          });
          return;
        }
        const storageRef = storage.ref(); // vue-music-f1733.appspot.com
        const songRef = storageRef.child(`song/${file.name}`); // vue-music-f1733.appspot.com/songs/example.mp3
        const task = songRef.put(file); // snapshot

        // push method return "pushed data" index
        const uploadIndex =
          uploads.value.push({
            task,
            currentProgress: 0,
            name: file.name,
            variant: "bg-blue-400",
            icon: "fas fa-spinner fa-spin",
            textClass: "",
          }) - 1;

        // 監聽上傳事件
        task.on(
          "state_changed",
          (snapshot) => {
            // progressing
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // upload到多少%
            uploads.value[uploadIndex].currentProgress = progress;
          },
          (err) => {
            // error
            uploads.value[uploadIndex].variant = "bg-red-400";
            uploads.value[uploadIndex].icon = "fas fa-times";
            uploads.value[uploadIndex].textClass = "text-red-400";
            console.log(err);
          },
          async () => {
            // success
            const song = {
              uid: auth.currentUser.uid,
              displayName: auth.currentUser.displayName,
              originialName: task.snapshot.ref.name,
              modifiedName: task.snapshot.ref.name,
              genre: "",
              commentCount: 0,
            };

            try {
              // 取得download URL
              song.url = await task.snapshot.ref.getDownloadURL();

              // song add to collection (return reference)
              const songRef = await songsCollection.add(song);

              // get doc ID
              const songSnapshot = await songRef.get();
              const docID = songSnapshot.id;

              // set docID to collection
              await songsCollection.doc(docID).set(
                {
                  docID,
                },
                { merge: true }
              );

              // add song data to ManageView songs array to display song
              props.addSong(songSnapshot, docID);
              getAllSongs();
              showFetchedSongs.value = false;
            } catch (err) {
              console.log(err);
            }

            uploads.value[uploadIndex].variant = "bg-green-400";
            uploads.value[uploadIndex].icon = "fas fa-check";
            uploads.value[uploadIndex].textClass = "text-green-400";
          }
        );
      });
    };

    const cancelUpload = (upload) => {
      upload.task.cancel();
      uploads.value = uploads.value.filter((u) => u !== upload);
    };

    return {
      isDragover,
      uploads,
      uploadFile,
      cancelUpload,
    };
  },
};
</script>

<style scoped>
/* fadeout 效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.progress-bar {
  height: 100%;
}
</style>
