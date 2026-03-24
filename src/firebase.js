import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyArnLEpHHofE8CjeSa2Amtpn4Eia9c86tQ",
  authDomain: "ai-financial-guardian-31c4e.firebaseapp.com",
  projectId: "ai-financial-guardian-31c4e",
  storageBucket: "ai-financial-guardian-31c4e.firebasestorage.app",
  messagingSenderId: "453202386099",
  appId: "1:453202386099:web:4232516da366d3a7cda4c6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

