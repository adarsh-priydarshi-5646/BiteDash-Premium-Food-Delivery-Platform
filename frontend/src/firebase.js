import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: 'vingo-b3fd6.firebaseapp.com',
  projectId: 'vingo-b3fd6',
  storageBucket: 'vingo-b3fd6.firebasestorage.app',
  messagingSenderId: '750640341001',
  appId: '1:750640341001:web:84e89d28e63ba5015818d8',
};

let app = null;
let auth = null;

try {
  if (import.meta.env.VITE_FIREBASE_APIKEY && import.meta.env.VITE_FIREBASE_APIKEY !== 'your_firebase_api_key') {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  }
} catch (error) {
  console.warn('Firebase initialization failed. Google Sign-in will be disabled.');
}

export { app, auth };
