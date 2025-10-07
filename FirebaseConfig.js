// FirebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4Ov0zCYm4Qo5CS3yJPEDnGzfIZk2fcAM",
  authDomain: "smart-study-43b26.firebaseapp.com",
  projectId: "smart-study-43b26",
  storageBucket: "smart-study-43b26.appspot.com", // ✅ fixed here
  messagingSenderId: "463495526735",
  appId: "1:463495526735:web:a199c21a789bbef04aad3a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore
export const db = getFirestore(app);
