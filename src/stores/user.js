import { defineStore } from "pinia";
import { auth, usersCollection } from "@/includes/firebase";

export default defineStore("user", {
  state: () => ({
    userLoggedIn: false,
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
        age: values.age,
        country: values.country,
      });

      // storing profile in firebase
      await userCred.user.updateProfile({
        displayName: values.name,
      });
      this.userLoggedIn = true;
    },
    async authenticateAction(values) {
      await auth.signInWithEmailAndPassword(values.email, values.password);
      this.userLoggedIn = true;
    },
    async signoutAction() {
      await auth.signOut();
      this.userLoggedIn = false;
    },
  },
});
