import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBW6PoZ2TMbkHqetNiLt0rUivdgbsM6ivs",
  authDomain: "ybeauty-f45b6.firebaseapp.com",
  databaseURL: "https://ybeauty-f45b6-default-rtdb.firebaseio.com",
  projectId: "ybeauty-f45b6",
  storageBucket: "ybeauty-f45b6.firebasestorage.app",
  messagingSenderId: "854762032933",
  appId: "1:854762032933:web:8c0004ca975950761294cc",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
