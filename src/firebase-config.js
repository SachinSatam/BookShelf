// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsRYJpMHRC3xOv2SP5PoRrZzjnUo7EksQ",
  authDomain: "cclminiproj-6fd03.firebaseapp.com",
  projectId: "cclminiproj-6fd03",
  storageBucket: "cclminiproj-6fd03.appspot.com",
  messagingSenderId: "804838734335",
  appId: "1:804838734335:web:508b44ad286af15e498fca",
  measurementId: "G-VYDCN56DTB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
export const storage=getStorage(app);