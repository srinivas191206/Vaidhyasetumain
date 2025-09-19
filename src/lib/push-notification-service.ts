// Push Notification Service for Telemedicine Platform
// This service handles browser push notifications for real-time alerts

import { 
  sendNotification,
  type Notification as AppNotification
} from '@/lib/notification-service';

// Check if service worker is supported
const isServiceWorkerSupported = (): boolean => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

// Register service worker for push notifications
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!isServiceWorkerSupported()) {
    console.warn('Service workers are not supported in this browser');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service worker registered:', registration);
    return registration;
  } catch (error) {
    console.error('Service worker registration failed:', error);
    return null;
  }
};

// Request notification permission from user
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    console.log('Notification permission status:', permission);
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
};

// Show browser notification
export const showBrowserNotification = (
  title: string,
  options: any = {}
): void => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/logo.png',
      badge: '/logo.png',
      ...options
    });
  } else if (Notification.permission !== 'denied') {
    // Request permission if not denied
    requestNotificationPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, {
          icon: '/logo.png',
          badge: '/logo.png',
          ...options
        });
      }
    });
  }
};

// Send push notification for appointment request
export const sendAppointmentRequestPush = async (
  doctorName: string,
  patientName: string,
  healthCenterName: string,
  urgency: 'normal' | 'urgent' | 'emergency'
): Promise<void> => {
  try {
    // Show browser notification
    const urgencyLabels = {
      normal: 'Routine',
      urgent: 'Urgent',
      emergency: 'Emergency'
    };

    showBrowserNotification(
      `${urgencyLabels[urgency]} Consultation Request`,
      {
        body: `${healthCenterName} requests ${urgency} consultation for patient ${patientName}`,
        tag: 'appointment-request',
        requireInteraction: true
      }
    );

    console.log('Push notification sent for appointment request');
  } catch (error) {
    console.error('Error sending push notification for appointment request:', error);
  }
};

// Send push notification for appointment acceptance
export const sendAppointmentAcceptedPush = async (
  doctorName: string,
  patientName: string,
  healthCenterName: string
): Promise<void> => {
  try {
    // Show browser notification
    showBrowserNotification(
      'Consultation Accepted',
      {
        body: `Dr. ${doctorName} has accepted the consultation request for ${patientName}`,
        tag: 'appointment-accepted'
      }
    );

    console.log('Push notification sent for appointment acceptance');
  } catch (error) {
    console.error('Error sending push notification for appointment acceptance:', error);
  }
};

// Send push notification for appointment rejection
export const sendAppointmentRejectedPush = async (
  doctorName: string,
  patientName: string,
  healthCenterName: string,
  rejectionReason: string
): Promise<void> => {
  try {
    // Show browser notification
    showBrowserNotification(
      'Consultation Request Declined',
      {
        body: `Dr. ${doctorName} declined the consultation request for ${patientName}. Reason: ${rejectionReason}`,
        tag: 'appointment-rejected'
      }
    );

    console.log('Push notification sent for appointment rejection');
  } catch (error) {
    console.error('Error sending push notification for appointment rejection:', error);
  }
};

// Send push notification for video call
export const sendVideoCallPush = async (
  userName: string,
  callType: 'invitation' | 'accepted' | 'ended'
): Promise<void> => {
  try {
    let title = '';
    let body = '';

    switch (callType) {
      case 'invitation':
        title = 'Video Call Invitation';
        body = `${userName} is inviting you to a video call`;
        break;
      case 'accepted':
        title = 'Video Call Accepted';
        body = `${userName} has accepted your video call`;
        break;
      case 'ended':
        title = 'Video Call Ended';
        body = `Your video call with ${userName} has ended`;
        break;
    }

    // Show browser notification
    showBrowserNotification(title, {
      body,
      tag: 'video-call',
      requireInteraction: callType === 'invitation'
    });

    console.log('Push notification sent for video call');
  } catch (error) {
    console.error('Error sending push notification for video call:', error);
  }
};

// Initialize push notifications
export const initializePushNotifications = async (): Promise<void> => {
  try {
    // Register service worker
    await registerServiceWorker();
    
    // Request notification permission
    await requestNotificationPermission();
    
    console.log('Push notifications initialized');
  } catch (error) {
    console.error('Error initializing push notifications:', error);
  }
};

// Handle incoming notifications from the app
export const handleAppNotification = async (notification: AppNotification): Promise<void> => {
  try {
    switch (notification.type) {
      case 'appointment_request':
        await sendAppointmentRequestPush(
          notification.fromUserName,
          notification.data?.patientName || 'Patient',
          notification.data?.healthCenterName || 'Health Center',
          notification.priority
        );
        break;
        
      case 'appointment_accepted':
        await sendAppointmentAcceptedPush(
          notification.fromUserName,
          notification.data?.patientName || 'Patient',
          notification.data?.healthCenterName || 'Health Center'
        );
        break;
        
      case 'appointment_rejected':
        await sendAppointmentRejectedPush(
          notification.fromUserName,
          notification.data?.patientName || 'Patient',
          notification.data?.healthCenterName || 'Health Center',
          notification.data?.rejectionReason || 'No reason provided'
        );
        break;
        
      case 'video_call_invitation':
      case 'video_call_accepted':
      case 'video_call_ended':
        await sendVideoCallPush(
          notification.fromUserName,
          notification.type === 'video_call_invitation' ? 'invitation' : 
          notification.type === 'video_call_accepted' ? 'accepted' : 'ended'
        );
        break;
        
      default:
        // For other notification types, show a generic notification
        showBrowserNotification(
          notification.title,
          {
            body: notification.message,
            tag: notification.type
          }
        );
        break;
    }
  } catch (error) {
    console.error('Error handling app notification:', error);
  }
};