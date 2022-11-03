import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA9nkgh5TMs_gqxfIhj73CH0fgB4GQxOCY",
  authDomain: "vue-music-f1733.firebaseapp.com",
  projectId: "vue-music-f1733",
  storageBucket: "vue-music-f1733.appspot.com",
  appId: "1:189245487503:web:7b9adbfbd694e523e5f3fa",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

const usersCollection = db.collection("users");
const songsCollection = db.collection("songs");
const commentCollection = db.collection("comments");

export {
  auth,
  db,
  usersCollection,
  songsCollection,
  commentCollection,
  storage,
};
