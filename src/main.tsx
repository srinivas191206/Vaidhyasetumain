import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializePushNotifications } from "@/lib/push-notification-service";

// Initialize push notifications when the app starts
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    console.log('Initializing push notifications');
    await initializePushNotifications();
  });
} else {
  console.warn('Service Workers are not supported in this browser');
}

createRoot(document.getElementById("root")!).render(<App />);