// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0lcH0MWPGbSsfEB3ZkGVrvu9h1m5F8YY",
  authDomain: "cast-espace-membre.firebaseapp.com",
  projectId: "cast-espace-membre",
  storageBucket: "cast-espace-membre.firebasestorage.app",
  messagingSenderId: "665168161680",
  appId: "1:665168161680:web:66260020196e0e25546115",
  measurementId: "G-8MP04MJMS1"
};

const app = initializeApp(firebaseConfig);

// ✅ Exports nécessaires
export const auth = getAuth(app);
export const db = getFirestore(app);