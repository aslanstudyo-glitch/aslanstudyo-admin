import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD_8uX0Sz7whiosp73vA670R6qB8imQgXM",
  authDomain: "aslan-studyo.firebaseapp.com",
  databaseURL: "https://aslan-studyo-default-rtdb.firebaseio.com",
  projectId: "aslan-studyo",
  storageBucket: "aslan-studyo.firebasestorage.app",
  messagingSenderId: "26719014768",
  appId: "1:26719014768:web:7d651f3177e4afc54c49b5",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);

export default app;