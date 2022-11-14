<template>
  <div
    class="bg-white rounded border border-gray-200 mb-5 flex"
    v-if="!isUserInfoLoading"
  >
    <BaseModal :isModalOpen="isModalOpen" @closeModal="closeModal">
      modal
    </BaseModal>
    <!-- pic -->
    <div class="w-1/2 p-5 relative">
      <div class="rounded-full overflow-hidden relative">
        <img
          :src="
            userData.imgUrl ||
            'https://teameowdev.files.wordpress.com/2016/04/avatar24-01.png'
          "
          :alt="userData.name"
        />
      </div>
      <div>
        <label
          for="image-upload"
          class="absolute text-[20px] right-5 bottom-16 bg-stone-800 text-white rounded-full p-3 w-10 h-10 flex justify-center align-center hover:bg-stone-600 cursor-pointer"
        >
          <i class="fas fa-camera"></i>
        </label>
        <input
          class="hidden"
          id="image-upload"
          type="file"
          @change="uploadImg"
        />
      </div>
      <transition name="fade">
        <div
          class="mt-3 p-2 text-center text-white rounded transition-all"
          :class="upload.variant"
          v-if="upload.isMessageShow"
        >
          <i class="pr-1" :class="upload.icon"></i>{{ upload.message }}
        </div>
      </transition>
    </div>
    <!-- data -->
    <div class="w-1/2 p-5 flex flex-col justify-around align-center">
      <div class="font-bold text-[24px] flex justify-between">
        <p>{{ userData.name }}</p>
        <div
          @click="isModalOpen = true"
          class="text-[20px] right-5 bottom-16 bg-stone-800 text-white rounded-full p-3 w-10 h-10 flex justify-center align-center hover:bg-stone-600 cursor-pointer"
        >
          <i class="fas fa-pen"></i>
        </div>
      </div>

      <div>
        <i class="fas fa-globe text-black w-[10px] mr-3"></i>
        {{ userData.country }}
      </div>
      <div>
        <i class="far fa-envelope text-black w-[10px] mr-3"></i>
        {{ userData.email }}
      </div>
      <div>
        <i class="fas fa-user-circle text-black w-[10px] mr-3"></i>
        {{ userData.age }}
      </div>
    </div>
  </div>

  <!-- skeleton -->
  <div
    class="bg-white rounded border border-gray-200 mb-5 flex animate-pulse"
    v-else
  >
    <div class="w-1/2 p-5">
      <div class="rounded-full overflow-hidden">
        <img
          src="https://teameowdev.files.wordpress.com/2016/04/avatar24-01.png"
          alt=""
        />
      </div>
    </div>
    <div class="p-5 flex flex-col justify-around align-center">
      <div
        v-for="i in 4"
        :key="i"
        class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-40 mb-2"
      ></div>
    </div>
  </div>
</template>

<script>
import { storage, auth, usersCollection } from "../includes/firebase";
export default {
  props: [
    "userData",
    "isUserInfoLoading",
    "addUserInfo",
    "forceUpdate",
    "getUserData",
  ],
  data() {
    return {
      upload: {},
      isModalOpen: false,
    };
  },
  methods: {
    closeModal() {
      this.isModalOpen = false;
    },
    uploadImg(e) {
      const files = e.dataTransfer
        ? [...e.dataTransfer.files] // for drag
        : [...e.target.files]; // for input

      files.forEach((file) => {
        if (file.type !== "image/png" && file.type !== "image/jpeg") {
          this.upload.isMessageShow = true;
          this.upload.message = "Please upload photos.";
          this.upload.variant = "bg-red-500";
          this.upload.icon = "far fa-exclamation-circle";
          return;
        }
        this.upload.isMessageShow = true;
        this.upload.message = "Updating...";
        this.upload.variant = "bg-blue-500";
        this.upload.icon = null;

        // 如果ofline就無法上傳檔案
        if (!navigator.onLine) {
          return;
        }
        const storageRef = storage.ref(); // vue-music-f1733.appspot.com
        const stickerRef = storageRef.child(`user-sticker/${file.name}`); // vue-music-f1733.appspot.com/songs/example.mp3
        const task = stickerRef.put(file); // snapshot

        // 監聽上傳事件
        task.on(
          "state_changed",
          null,
          (err) => {
            // error
            console.log(err);
            return;
          },
          async () => {
            // success
            const userInfo = {
              uid: auth.currentUser.uid,
              name: auth.currentUser.displayName, // !!!!!!!!!!!!!!!!!! this is null
              country: this.userData.country,
              email: this.userData.email,
              age: this.userData.age,
            };

            // 取得download URL
            userInfo.imgUrl = await task.snapshot.ref.getDownloadURL();

            // song add to collection (return reference)
            try {
              await usersCollection.doc(auth.currentUser.uid).update(userInfo);
            } catch (err) {
              this.upload.isMessageShow = true;
              this.upload.message = "Something went wrong :(";
              this.upload.variant = "bg-red-500";
              this.upload.icon = "far fa-exclamation-circle";
              return;
            }

            this.upload.isMessageShow = true;
            this.upload.message = "Upload photo success!";
            this.upload.icon = "far fa-check-circle";
            this.upload.variant = "bg-green-500";
            setTimeout(() => {
              this.upload.isMessageShow = false;
              this.getUserData();
            }, 3000);
          }
        );
      });

      console.log(files);
    },
  },
  created() {
    console.log(auth.currentUser.uid);
  },
};
</script>

<style scoped>
.fade-enter-active {
  animation: fade 0.2s;
}
.fade-leave-active {
  animation: fade 0.2s reverse;
}
@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
