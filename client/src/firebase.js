// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-stack-6ac04.firebaseapp.com",
  projectId: "mern-stack-6ac04",
  storageBucket: "mern-stack-6ac04.appspot.com",
  messagingSenderId: "712683909673",
  appId: "1:712683909673:web:b1ac6a6b4e49be8e2b2238"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);