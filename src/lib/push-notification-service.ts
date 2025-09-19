// Mock Push Notification Service for Firebase Messaging
// This replaces the actual Firebase Messaging implementation with mock functionality

/**
 * Initialize push notifications for the telemedicine platform (Mock Implementation)
 */
export const initializePushNotifications = async (): Promise<void> => {
  try {
    console.log('Mock: Initializing push notifications');
    
    // Simulate checking if Firebase Messaging is supported
    const isSupported = true;
    if (!isSupported) {
      console.warn('Mock: Firebase Messaging is not supported in this browser');
      return;
    }
    
    // Simulate getting FCM token
    const token = 'mock-fcm-token';
    console.log('Mock: Got FCM token:', token);
    
    // Store token in localStorage for demo purposes
    localStorage.setItem('fcmToken', token);
    
    console.log('Mock: Push notifications initialized successfully');
  } catch (error) {
    console.error('Mock: Error initializing push notifications:', error);
  }
};

/**
 * Request notification permission from user (Mock Implementation)
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  try {
    console.log('Mock: Requesting notification permission');
    
    // Simulate requesting permission
    const permission: NotificationPermission = 'granted';
    console.log('Mock: Notification permission:', permission);
    
    return permission;
  } catch (error) {
    console.error('Mock: Error requesting notification permission:', error);
    return 'denied';
  }
};

/**
 * Show a notification to the user (Mock Implementation)
 */
export const showNotification = async (title: string, options?: NotificationOptions): Promise<void> => {
  try {
    console.log('Mock: Showing notification:', title, options);
    
    // Simulate showing notification
    if (Notification.permission === 'granted') {
      // In a real implementation, this would show an actual notification
      console.log('Mock: Notification would be shown to user');
    } else {
      console.warn('Mock: Notification permission not granted');
    }
  } catch (error) {
    console.error('Mock: Error showing notification:', error);
  }
};

/**
 * Handle incoming foreground messages (Mock Implementation)
 */
export const onForegroundMessage = (callback: (payload: any) => void): void => {
  console.log('Mock: Setting up foreground message handler');
  
  // Simulate receiving a message after a delay
  setTimeout(() => {
    const mockPayload = {
      notification: {
        title: 'Mock Notification',
        body: 'This is a mock notification message'
      },
      data: {
        url: '/dashboard'
      }
    };
    
    callback(mockPayload);
  }, 5000);
  
  console.log('Mock: Foreground message handler set up');
};