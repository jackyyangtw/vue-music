<template>
  <div
    class="bg-white rounded border border-gray-200 mb-5 flex"
    v-if="!isUserInfoLoading"
  >
    <BaseModal
      :isModalOpen="isModalOpen"
      @closeModal="closeModal"
      :isForm="true"
    >
      <p class="font-bold text-2xl py-10 text-center" v-if="isUpdatingUserInfo">
        <svg
          class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="black"
            stroke-width="4"
          ></circle>
          <path
            fill="black"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Updateing...
      </p>
      <VeeForm @submit="updateUserInfo" :initial-values="userData" v-else>
        <div class="mb-3">
          <label class="inline-block mb-2">Name</label>
          <!-- Name -->
          <vee-field
            name="name"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            :placeholder="userData.name"
          />
          <ErrorMessage class="text-red-600" name="name"></ErrorMessage>
        </div>
        <!-- Age -->
        <div class="mb-3">
          <label class="inline-block mb-2">Age</label>
          <vee-field
            type="number"
            name="age"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          />
          <ErrorMessage class="text-red-600" name="age"></ErrorMessage>
        </div>
        <!-- Email -->
        <div class="mb-3">
          <label class="inline-block mb-2">Email</label>
          <vee-field
            type="email"
            name="email"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Email"
            v-model="userEmail"
            @change="userEmailChange"
          />
          <ErrorMessage class="text-red-600" name="email"></ErrorMessage>
        </div>
        <!-- Country -->
        <div class="mb-3">
          <label class="inline-block mb-2">Country</label>
          <vee-field
            as="select"
            name="country"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option
              v-for="country in allCountry"
              :key="country.name"
              :value="country.name"
            >
              {{ country.name }}
            </option>
          </vee-field>
          <ErrorMessage class="text-red-600" name="country"></ErrorMessage>
        </div>
        <div class="flex justify-end items-center pb-4">
          <!-- left -->
          <BaseButton
            @click="closeModal"
            type="button"
            class="mr-5"
            :blue="true"
            >Cancel</BaseButton
          >
          <!-- right -->
          <BaseButton red="true" type="submit">Submit</BaseButton>
        </div>
      </VeeForm>
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
          class="absolute text-[20px] right-5 bottom-16 bg-stone-600 hover:bg-stone-500 text-white rounded-full p-3 w-10 h-10 flex justify-center align-center cursor-pointer"
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
    <!-- content -->
    <div class="w-1/2 p-5 flex flex-col justify-around align-center">
      <div class="font-bold text-[24px] flex justify-between">
        <p>{{ userData.name }}</p>
        <div
          @click="isModalOpen = true"
          class="text-[20px] right-5 bottom-16 bg-stone-600 hover:bg-stone-500 text-white rounded-full p-3 w-10 h-10 flex justify-center align-center cursor-pointer"
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
// import { getAuth, updateEmail } from "firebase/auth";
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
      allCountry: [],
      initialvalues: {
        name: this.userData.name,
      },
      isUpdatingUserInfo: false,
      userEmail: "",
      isUserEmailChange: false,
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
    async updateUserInfo(value) {
      const submitedData = {
        age: value.age ?? this.userData.age,
        country: value.country ?? this.userData.country,
        email: value.email ?? this.userData.email,
        name: value.name ?? this.userData.name,
      };
      try {
        this.isUpdatingUserInfo = true;
        await usersCollection.doc(auth.currentUser.uid).update(submitedData);
        if (submitedData.email !== this.userData.email) {
          // change email
          // await auth.signInWithEmailAndPassword(
          //   submitedData.email,
          //   submitedData.password
          // );
        }
      } catch (err) {
        console.log(err);
        return;
      }
      this.getUserData();
      this.closeModal();
      this.isUpdatingUserInfo = false;
      console.log(submitedData);
    },
    userEmailChange() {
      // console.log(this.userEmail);
    },
  },
  // computed: {
  //   isEmailInputChange: {
  //     if()
  //   }
  // },
  watch: {
    userEmail(newVal, oldVal) {
      if (newVal !== oldVal) {
        console.log("email change!");
        this.isUserEmailChange = true;
      } else {
        this.isUserEmailChange = false;
      }
    },
  },
  async created() {
    console.log(auth.currentUser.uid);
    const res = await fetch("https://restcountries.com/v2/all");
    const data = await res.json();
    data.forEach((data) => this.allCountry.push(data));
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
