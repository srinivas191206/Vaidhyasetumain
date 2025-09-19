// Firebase configuration for Vaidhya Setu telemedicine platform (JavaScript version)
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { getMessaging } from 'firebase/messaging';

// Firebase configuration object using Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDIQP3Mgu1BpF4pftSelrDvE8nQSbhXwQ8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "hackathon-79e80.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "hackathon-79e80",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "hackathon-79e80.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "338581325054",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:338581325054:web:10ad1b4e1793d5a7b491af",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-WN45LN4MR6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Analytics (only in browser environment)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Messaging (only in browser environment)
let messaging = null;
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  // Messaging requires service worker support
  messaging = getMessaging(app);
}

// Export services for use across telemedicine platform
export { auth, db, storage, analytics, messaging };
export default app;