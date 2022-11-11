<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': isDragover }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="isDragover = false"
        @dragover.prevent.stop="isDragover = true"
        @dragenter.prevent.stop="isDragover = true"
        @dragleave.prevent.stop="isDragover = false"
        @drop.prevent.stop="uploadFile($event)"
      >
        <h5>Drop your files here</h5>
      </div>
      <input type="file" mutiple @change="uploadFile($event)" />
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="upload.textClass">
          <i class="mr-2" :class="upload.icon"></i>{{ upload.name }}
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
    </div>
  </div>
</template>

<script>
import { storage, auth, songsCollection } from "@/includes/firebase";
export default {
  props: ["addSong"],
  data() {
    return {
      isDragover: false,
      uploads: [],
    };
  },
  mounted() {
    // console.log("user data:", auth.currentUser);
  },
  methods: {
    uploadFile(e) {
      this.isDragover = false;

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
          this.uploads.push({
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
          this.uploads.push({
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
            this.uploads[uploadIndex].currentProgress = progress;
          },
          (err) => {
            // error
            this.uploads[uploadIndex].variant = "bg-red-400";
            this.uploads[uploadIndex].icon = "fas fa-times";
            this.uploads[uploadIndex].textClass = "text-red-400";
            console.log(err);
          },
          async () => {
            // success
            const song = {
              uid: auth.currentUser.uid,
              displayName: auth.currentUser.displayName, // !!!!!!!!!!!!!!!!!! this is null
              originialName: task.snapshot.ref.name,
              modifiedName: task.snapshot.ref.name,
              genre: "",
              commentCount: 0,
            };

            // 取得download URL
            song.url = await task.snapshot.ref.getDownloadURL();

            // song add to collection (return reference)
            const songRef = await songsCollection.add(song);

            // get song snapshot to access .data()
            const songSnapshot = await songRef.get();

            // add song data to ManageView songs array to display song
            this.addSong(songSnapshot);

            this.uploads[uploadIndex].variant = "bg-green-400";
            this.uploads[uploadIndex].icon = "fas fa-check";
            this.uploads[uploadIndex].textClass = "text-green-400";
          }
        );
      });

      console.log(files);
    },
    cancelUploads() {
      this.uploads.forEach((upload) => {
        upload.task.cancel();
      });
    },
  },
  beforeUnmount() {
    // 換頁前cancel uploading
    this.uploads.forEach((upload) => {
      upload.task.cancel();
    });
  },
};
</script>
