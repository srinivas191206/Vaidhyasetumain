// Firebase configuration for Vaidhya Setu telemedicine platform (JavaScript version)
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyDIQP3Mgu1BpF4pftSelrDvE8nQSbhXwQ8",
  authDomain: "hackathon-79e80.firebaseapp.com",
  projectId: "hackathon-79e80",
  storageBucket: "hackathon-79e80.firebasestorage.app",
  messagingSenderId: "338581325054",
  appId: "1:338581325054:web:10ad1b4e1793d5a7b491af",
  measurementId: "G-WN45LN4MR6"
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

// Export services for use across telemedicine platform
export { auth, db, storage, analytics };
export default app;