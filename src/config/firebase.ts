import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "employee-manager-daa1a.firebaseapp.com",
  projectId: "employee-manager-daa1a",
  storageBucket: "employee-manager-daa1a.firebasestorage.app",
  messagingSenderId: "793355843894",
  appId: "1:793355843894:web:cd915c365fc8c250555b97",
  measurementId: "G-P2BRRPYX6V"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
