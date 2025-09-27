// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDoxvryUVjLKG2iF9rWl-hslQWvVByUEnQ",
  authDomain: "qwikko-b7ace.firebaseapp.com",
  projectId: "qwikko-b7ace",
  storageBucket: "qwikko-b7ace.firebasestorage.app",
  messagingSenderId: "735557421843",
  appId: "1:735557421843:web:b8d95d7fdab2ea3bf068e6",
  measurementId: "G-P3DEB6XKW9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

