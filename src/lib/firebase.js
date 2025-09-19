// Mock Firebase configuration for Vaidhya Setu telemedicine platform (JavaScript version)
// This replaces the actual Firebase services with mock implementations
// allowing the application to run without Firebase dependencies

// Import mock service implementations
import {
  initializeApp,
  getAuth,
  collection,
  addDoc,
  getDoc,
  updateDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  getStorage,
  getAnalytics,
  getMessaging
} from '@/lib/mock-services';

// Mock Firebase configuration object
const firebaseConfig = {
  apiKey: "mock-api-key",
  authDomain: "mock-auth-domain",
  projectId: "mock-project-id",
  storageBucket: "mock-storage-bucket",
  messagingSenderId: "mock-messaging-sender-id",
  appId: "mock-app-id",
  measurementId: "mock-measurement-id"
};

// Initialize Mock Firebase
const app = initializeApp(firebaseConfig);

// Initialize Mock Firebase services
const auth = getAuth(app);
const db = {  // Mock database object
  collection: (name) => collection(db, name)
};
const storage = getStorage(app);

// Initialize Mock Analytics (only in browser environment)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Mock Messaging (only in browser environment)
let messaging = null;
if (typeof window !== 'undefined') {
  messaging = getMessaging(app);
}

// Export mock services for use across telemedicine platform
export { auth, db, storage, analytics, messaging, 
         collection, addDoc, getDoc, updateDoc, doc, 
         query, where, onSnapshot, serverTimestamp, Timestamp };

export default app;