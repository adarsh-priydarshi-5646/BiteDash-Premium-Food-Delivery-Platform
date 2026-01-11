/**
 * Firebase Configuration - BiteDash Google OAuth Setup
 * 
 * Initializes Firebase app with environment variables for authentication
 * Exports auth instance for Google sign-in functionality
 * TODO: Create new Firebase project named "bitedash" to replace legacy config
 */
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "vingo-b3fd6.firebaseapp.com",
  projectId: "vingo-b3fd6",
  storageBucket: "vingo-b3fd6.firebasestorage.app",
  messagingSenderId: "750640341001",
  appId: "1:750640341001:web:84e89d28e63ba5015818d8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { app, auth };
