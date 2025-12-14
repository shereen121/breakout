// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAubjKdiEqfDpW-tc94-l-AI7lbPs7IU04",
  authDomain: "breakout-d5088.firebaseapp.com",
  projectId: "breakout-d5088",
  storageBucket: "breakout-d5088.firebasestorage.app",
  messagingSenderId: "57071720148",
  appId: "1:57071720148:web:1a628bbb31191d11efcd41",
  measurementId: "G-PY1H9HKJB7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth + Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
