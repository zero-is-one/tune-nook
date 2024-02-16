// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBH3b7yREkXn7p7Mn3hUoR6xOj7XgL_f9I",
  authDomain: "tune-nook.firebaseapp.com",
  projectId: "tune-nook",
  storageBucket: "tune-nook.appspot.com",
  messagingSenderId: "473868903370",
  appId: "1:473868903370:web:9ed8b5c108bdbf9ad86533",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
