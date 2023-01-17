import { defineStore } from "pinia";
import { auth, usersCollection } from "@/includes/firebase";
import { ref } from "vue";
export const useUserStore = defineStore("user", () => {
  const userLoggedIn = ref(false);
  const userData = ref({});

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
    await authenticateAction(values);
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

  return {
    userLoggedIn,
    userData,
    registerAction,
    authenticateAction,
    signoutAction,
    getUserDataAction,
  };
});
