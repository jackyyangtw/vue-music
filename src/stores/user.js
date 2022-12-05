import { defineStore } from "pinia";
import { auth, usersCollection, songsCollection } from "@/includes/firebase";
import { ref } from "vue";
export const useUserStore = defineStore("user", () => {
  const userLoggedIn = ref(false);
  const userData = ref({});
  const songs = ref([]);

  const registerAction = async (values) => {
    const userCred = await auth.createUserWithEmailAndPassword(
      values.email,
      values.password
    );

    // add document to collection，將uid 存入document
    await usersCollection.doc(userCred.user.uid).set({
      name: values.name,
      email: values.email,
      password: values.password,
      age: values.age,
      country: values.country,
    });

    // storing profile in firebase
    await userCred.user.updateProfile({
      displayName: values.name,
    });
    await this.authenticateAction(values);
  };
  const authenticateAction = async (values) => {
    await auth.signInWithEmailAndPassword(values.email, values.password);
    userLoggedIn.value = true;
  };
  const signoutAction = async () => {
    await auth.signOut();
    userLoggedIn.value = false;
  };
  const getUserDataAction = async () => {
    const userSnapshot = await usersCollection.doc(auth.currentUser.uid).get();
    const datas = userSnapshot.data();
    userData.value = {
      ...datas,
    };
  };
  const getUserSongDataAction = async (addSong) => {
    const snapshot = await songsCollection
      .where("uid", "==", auth.currentUser.uid)
      .get();

    snapshot.forEach(addSong);
  };
  return {
    userLoggedIn,
    userData,
    songs,
    registerAction,
    authenticateAction,
    signoutAction,
    getUserDataAction,
    getUserSongDataAction,
  };
});

export default defineStore("user", {
  state: () => ({
    userLoggedIn: false,
    userData: {},
    songs: [],
  }),
  actions: {
    async registerAction(values) {
      const userCred = await auth.createUserWithEmailAndPassword(
        values.email,
        values.password
      );

      // add document to collection，將uid 存入document
      await usersCollection.doc(userCred.user.uid).set({
        name: values.name,
        email: values.email,
        password: values.password,
        age: values.age,
        country: values.country,
      });

      // storing profile in firebase
      await userCred.user.updateProfile({
        displayName: values.name,
      });
      await this.authenticateAction(values);
    },
    async authenticateAction(values) {
      await auth.signInWithEmailAndPassword(values.email, values.password);
      this.userLoggedIn = true;
    },
    async signoutAction() {
      await auth.signOut();
      this.userLoggedIn = false;
    },
    async getUserDataAction() {
      const userSnapshot = await usersCollection
        .doc(auth.currentUser.uid)
        .get();
      const datas = userSnapshot.data();
      this.userData = {
        ...datas,
      };
    },
    async getUserSongDataAction(addSong) {
      const snapshot = await songsCollection
        .where("uid", "==", auth.currentUser.uid)
        .get();

      snapshot.forEach(addSong);
    },
  },
});
