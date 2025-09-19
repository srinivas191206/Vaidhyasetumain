import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize push notifications for the telemedicine platform
import { initializePushNotifications } from '@/lib/push-notification-service';

// Initialize push notifications when the app starts
if ('serviceWorker' in navigator) {
  // Register the service worker for Firebase Messaging
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
        // Initialize push notifications after service worker is registered
        initializePushNotifications();
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
} else {
  console.warn('Service Workers are not supported in this browser');
}

createRoot(document.getElementById("root")!).render(<App />);
