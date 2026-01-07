// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4URvSFfD7KwqfB4TW_hbZnW_QsBe5Rns",
  authDomain: "spck-jsi-92ce4.firebaseapp.com",
  projectId: "spck-jsi-92ce4",
  storageBucket: "spck-jsi-92ce4.firebasestorage.app",
  messagingSenderId: "223464951502",
  appId: "1:223464951502:web:82838c04af22a01f26ca9f",
  measurementId: "G-5F63ESC9BC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);