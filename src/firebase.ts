import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB1jAp33XVhH1Q7pWvjpRyGqPCDcf3u2R0",
  authDomain: "employee-manager-daa1a.firebaseapp.com",
  projectId: "employee-manager-daa1a",
  storageBucket: "employee-manager-daa1a.firebasestorage.app",
  messagingSenderId: "793355843894",
  appId: "1:793355843894:web:cd915c365fc8c250555b97",
  measurementId: "G-P2BRRPYX6V"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);