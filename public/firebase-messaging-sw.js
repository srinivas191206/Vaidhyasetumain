// Firebase Messaging Service Worker for Vaidhya Setu Telemedicine Platform
// This service worker is required for Firebase Cloud Messaging to work

importScripts('https://www.gstatic.com/firebasejs/12.2.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.2.1/firebase-messaging-compat.js');

// Firebase configuration
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
firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging object
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  // Customize notification here
  const notificationTitle = payload.notification?.title || 'Vaidhya Setu Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: payload.notification?.icon || '/vaidhya-setu-logo.png',
    badge: '/favicon.ico',
    data: payload.data || {}
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received:', event);
  event.notification.close();
  
  // Handle notification click action
  if (event.notification.data && event.notification.data.click_action) {
    event.waitUntil(
      clients.openWindow(event.notification.data.click_action)
    );
  }
});