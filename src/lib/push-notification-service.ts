// Push Notification Service for Vaidhya Setu Telemedicine Platform
import { messaging } from './firebase';
import { getToken, onMessage, isSupported } from 'firebase/messaging';

/**
 * Request permission for push notifications
 * @returns {Promise<boolean>} Whether permission was granted
 */
export async function requestPushNotificationPermission(): Promise<boolean> {
  if (!await isSupported()) {
    console.warn('Firebase Messaging is not supported in this browser');
    return false;
  }

  if (!messaging) {
    console.warn('Firebase Messaging is not initialized');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted');
      return true;
    } else {
      console.log('Unable to get permission to notify');
      return false;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

/**
 * Get Firebase Messaging token for push notifications
 * @returns {Promise<string|null>} The FCM token or null if not available
 */
export async function getMessagingToken(): Promise<string | null> {
  if (!await isSupported()) {
    console.warn('Firebase Messaging is not supported in this browser');
    return null;
  }

  if (!messaging) {
    console.warn('Firebase Messaging is not initialized');
    return null;
  }

  try {
    // Get registration token
    const currentToken = await getToken(messaging, { 
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY 
    });
    
    if (currentToken) {
      console.log('Current token for client:', currentToken);
      return currentToken;
    } else {
      console.log('No registration token available. Request permission to generate one.');
      return null;
    }
  } catch (error) {
    console.error('An error occurred while retrieving token:', error);
    return null;
  }
}

/**
 * Listen for foreground messages
 * @param {Function} callback Function to handle received messages
 */
export function onForegroundMessage(callback: (payload: any) => void): void {
  if (!messaging) {
    console.warn('Firebase Messaging is not initialized');
    return;
  }

  onMessage(messaging, (payload) => {
    console.log('Message received in foreground:', payload);
    callback(payload);
  });
}

/**
 * Show a notification using the browser's Notification API
 * @param {string} title Notification title
 * @param {string} body Notification body
 * @param {Object} data Additional data
 */
export function showLocalNotification(title: string, body: string, data: Record<string, any> = {}): void {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notification');
    return;
  }

  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body: body,
      icon: '/vaidhya-setu-logo.png',
      data: data
    });

    notification.onclick = function(event) {
      event.preventDefault();
      window.focus();
      notification.close();
      
      // Handle notification click action if provided
      if (data.click_action) {
        window.open(data.click_action, '_blank');
      }
    };
  }
}

/**
 * Initialize push notifications
 * @returns {Promise<void>}
 */
export async function initializePushNotifications(): Promise<void> {
  if (!await isSupported()) {
    console.warn('Firebase Messaging is not supported in this browser');
    return;
  }

  const hasPermission = await requestPushNotificationPermission();
  if (hasPermission) {
    const token = await getMessagingToken();
    if (token) {
      // In a real application, you would send this token to your server
      console.log('FCM Token:', token);
      
      // Listen for foreground messages
      onForegroundMessage((payload) => {
        console.log('Foreground message received:', payload);
        
        // Show local notification for foreground messages
        showLocalNotification(
          payload.notification?.title || 'Vaidhya Setu Notification',
          payload.notification?.body || 'You have a new notification',
          payload.data
        );
      });
    }
  }
}

// Export types
export type { Messaging };