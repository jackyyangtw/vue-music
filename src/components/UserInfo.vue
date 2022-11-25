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
      <p
        class="font-bold text-2xl py-10 text-center"
        v-if="isUpdatingUserInfo && !updateInfo.hasError"
      >
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
      <p class="red" v-else-if="updateInfo.hasError">
        {{ updateInfo.hasErrorMsg }}
      </p>
      <VeeForm
        @submit="updateUserInfo"
        :initial-values="userData"
        :validation-schema="schema"
        v-else
      >
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
          />
          <ErrorMessage class="text-red-600" name="email"></ErrorMessage>
        </div>
        <!-- password -->
        <div class="mb-3">
          <label class="inline-block mb-2">Password</label>
          <vee-field
            type="text"
            name="password"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter password"
            v-model="userPassword"
          />
          <ErrorMessage class="text-red-600" name="password"></ErrorMessage>
        </div>
        <!-- Confirm Password -->
        <div class="mb-3" v-if="isUserPasswordChange">
          <label class="inline-block mb-2">Confirm Password</label>
          <vee-field
            type="password"
            name="confirm_password"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Confirm Password"
          />
          <ErrorMessage
            class="text-red-600"
            name="confirm_password"
          ></ErrorMessage>
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
      <div
        class="rounded-full overflow-hidden relative bg-cover bg-center h-52 relative"
      >
        <img
          class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
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
          :class="uploadPic.variant"
          v-if="uploadPic.isMessageShow"
        >
          <i class="pr-1" :class="uploadPic.icon"></i>{{ uploadPic.message }}
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
import {
  storage,
  auth,
  usersCollection,
  songsCollection,
} from "../includes/firebase";
// import { getAuth, updateEmail } from "firebase/auth";
export default {
  props: [
    "userData",
    "isUserInfoLoading",
    "addUserInfo",
    "forceUpdate",
    "getUserData",
  ],
  computed: {
    userPicUrl() {
      return `bg-[url('${
        this.userData.imgUrl ||
        "https://teameowdev.files.wordpress.com/2016/04/avatar24-01.png"
      }')]`;
    },
  },
  data() {
    return {
      uploadPic: {},
      updateInfo: {},
      isModalOpen: false,
      allCountry: [],
      initialvalues: {
        name: this.userData.name,
      },
      schema: {
        email: "min:3|max:100|email",
        password: "min:9|max:100|excluded:password",
        confirm_password: "",
      },
      isUpdatingUserInfo: false,
      userPassword: "",
      isUserPasswordChange: false,
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
          this.uploadPic.isMessageShow = true;
          this.uploadPic.message = "Please upload photos.";
          this.uploadPic.variant = "bg-red-500";
          this.uploadPic.icon = "far fa-exclamation-circle";
          return;
        }
        this.uploadPic.isMessageShow = true;
        this.uploadPic.message = "Updating...";
        this.uploadPic.variant = "bg-blue-500";
        this.uploadPic.icon = null;

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
              this.uploadPic.isMessageShow = true;
              this.uploadPic.message = "Something went wrong :(";
              this.uploadPic.variant = "bg-red-500";
              this.uploadPic.icon = "far fa-exclamation-circle";
              return;
            }

            this.uploadPic.isMessageShow = true;
            this.uploadPic.message = "upload photo success!";
            this.uploadPic.icon = "far fa-check-circle";
            this.uploadPic.variant = "bg-green-500";
            setTimeout(() => {
              this.uploadPic.isMessageShow = false;
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
        password: value.password ?? this.userData.password,
        name: value.name ?? this.userData.name,
      };
      try {
        let cred;
        this.isUpdatingUserInfo = true;

        if (
          submitedData.email !== this.userData.email ||
          submitedData.password !== this.userData.password
        ) {
          const getcred = async () => {
            return await auth.signInWithEmailAndPassword(
              this.userData.email,
              this.userData.password
            );
          };
          cred = getcred();
        }

        if (submitedData.email !== this.userData.email) {
          await cred.then((cred) => cred.user.updateEmail(submitedData.email));
        }

        if (submitedData.password !== this.userData.password) {
          await cred.then((cred) =>
            cred.user.updatePassword(submitedData.password)
          );
        }

        await usersCollection.doc(auth.currentUser.uid).update(submitedData);

        const songSnapshot = await songsCollection.get();

        let updatedData = [];
        songSnapshot.forEach((doc) => {
          const sid = doc.id;
          const songData = doc.data();
          if (songData.uid === auth.currentUser.uid) {
            updatedData.push({ sid, ...songData });
          }
        });
        updatedData.forEach((data) => {
          const updateSongCollection = async () => {
            await songsCollection.doc(data.sid).update({
              ...data,
              sid: data.sid,
              displayName: submitedData.name,
            });
          };
          updateSongCollection();
        });
      } catch (err) {
        this.updateInfo.hasError = true;
        this.updateInfo.hasErrorMsg = err;
        return;
      }
      this.getUserData();
      this.closeModal();
      this.isUpdatingUserInfo = false;
      console.log(submitedData);
    },
  },
  watch: {
    userPassword(newVal) {
      if (newVal !== this.userData.password) {
        this.isUserPasswordChange = true;
        this.schema.confirm_password = "passwords_mismatch:@password";
      } else {
        this.isUserPasswordChange = false;
        this.schema.confirm_password = "";
      }
    },
  },
  async created() {
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
