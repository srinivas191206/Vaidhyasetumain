// Real-time Notification Service for Doctor-Patient Sync (Mock Implementation)
// This replaces the actual Firestore operations with mock implementations

import { 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  onSnapshot,
  updateDoc,
  doc,
  getDoc,
  collection,
  Timestamp
} from '@/lib/firebase';
import { handleAppNotification } from '@/lib/push-notification-service';

// Mock implementation of Firebase Messaging functions
const isSupported = async () => {
  console.log('Mock: Checking if Firebase Messaging is supported');
  return true; // Always return true for mock
};

const getToken = async () => {
  console.log('Mock: Getting Firebase Messaging token');
  return 'mock-messaging-token'; // Return a mock token
};

// Notification types
export type NotificationType = 
  | 'appointment_request' 
  | 'appointment_accepted' 
  | 'appointment_rejected'
  | 'consultation_started'
  | 'consultation_completed'
  | 'prescription_ready'
  | 'feedback_request'
  | 'emergency_alert'
  | 'video_call_invitation'
  | 'video_call_accepted'
  | 'video_call_ended';

export interface Notification {
  id?: string;
  type: NotificationType;
  title: string;
  message: string;
  fromUserId: string;
  fromUserName: string;
  fromUserRole: 'doctor' | 'patient' | 'health_center';
  toUserId: string;
  toUserRole: 'doctor' | 'patient' | 'health_center';
  appointmentId?: string;
  patientId?: string;
  doctorId?: string;
  healthCenterId?: string;
  status: 'pending' | 'read' | 'accepted' | 'rejected' | 'expired';
  priority: 'normal' | 'urgent' | 'emergency';
  data?: Record<string, any>; // Additional data for the notification
  createdAt: any; // Using any to avoid type issues
  updatedAt: any;
  expiresAt?: any;
}

// Mock Firestore collections
const notificationsCollection = collection({} as any, 'notifications');

/**
 * Send a push notification using Firebase Messaging (Mock Implementation)
 */
async function sendPushNotification(notification: Omit<Notification, 'id'>): Promise<void> {
  // Only send push notifications in browser environment
  if (typeof window === 'undefined') {
    return;
  }

  try {
    console.log('Mock: Would send push notification:', notification.title, notification.message);
    // Handle the notification with our push notification service
    await handleAppNotification(notification as Notification);
  } catch (error) {
    console.error('Mock: Error sending push notification:', error);
  }
}

/**
 * Send a notification to a user (Mock Implementation)
 */
export const sendNotification = async (
  notificationData: Omit<Notification, 'id' | 'createdAt' | 'updatedAt' | 'status'>
): Promise<string> => {
  try {
    const notification: Omit<Notification, 'id'> = {
      ...notificationData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    console.log('Mock: Sending notification:', notification);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return a mock notification ID
    const notificationId = `mock-notification-${Date.now()}`;
    console.log('Mock: Notification sent:', notificationId);
    
    // Send push notification
    await sendPushNotification(notification);
    
    return notificationId;
  } catch (error) {
    console.error('Mock: Error sending notification:', error);
    throw new Error('Failed to send notification: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

/**
 * Send appointment request notification from patient/health center to doctor (Mock Implementation)
 */
export const sendAppointmentRequest = async (
  appointmentId: string,
  doctorId: string,
  patientId: string,
  patientName: string,
  healthCenterId: string,
  healthCenterName: string,
  urgency: 'normal' | 'urgent' | 'emergency',
  symptoms: string,
  requestedTime: Date
): Promise<string> => {
  const urgencyLabels = {
    normal: 'Routine',
    urgent: 'Urgent',
    emergency: 'Emergency'
  };

  const notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt' | 'status'> = {
    type: 'appointment_request',
    title: `${urgencyLabels[urgency]} Consultation Request`,
    message: `${healthCenterName} requests ${urgency} consultation for patient ${patientName}. Symptoms: ${symptoms}`,
    fromUserId: healthCenterId,
    fromUserName: healthCenterName,
    fromUserRole: 'health_center',
    toUserId: doctorId,
    toUserRole: 'doctor',
    appointmentId,
    patientId,
    doctorId,
    healthCenterId,
    priority: urgency,
    data: {
      patientName,
      symptoms,
      requestedTime: requestedTime.toISOString(),
      healthCenterName
    },
    // Set expiration time based on urgency
    expiresAt: urgency === 'emergency' 
      ? Timestamp.fromDate(new Date(Date.now() + 15 * 60 * 1000)) // 15 minutes
      : urgency === 'urgent'
      ? Timestamp.fromDate(new Date(Date.now() + 2 * 60 * 60 * 1000)) // 2 hours
      : Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)) // 24 hours
  };

  return await sendNotification(notification);
};

/**
 * Doctor accepts appointment request (Mock Implementation)
 */
export const acceptAppointmentRequest = async (
  notificationId: string,
  appointmentId: string,
  doctorId: string,
  doctorName: string,
  acceptanceMessage?: string
): Promise<void> => {
  try {
    console.log('Mock: Accepting appointment request', notificationId, appointmentId);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Simulate updating the original notification
    console.log('Mock: Updating original notification status to accepted');
    
    // Simulate sending acceptance notification back to health center
    const acceptanceNotification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt' | 'status'> = {
      type: 'appointment_accepted',
      title: 'Consultation Accepted',
      message: `Dr. ${doctorName} has accepted the consultation request. ${acceptanceMessage || 'Please prepare the patient for the video consultation.'}`,
      fromUserId: doctorId,
      fromUserName: doctorName,
      fromUserRole: 'doctor',
      toUserId: 'mock-health-center-id',
      toUserRole: 'health_center',
      appointmentId,
      patientId: 'mock-patient-id',
      doctorId,
      healthCenterId: 'mock-health-center-id',
      priority: 'normal',
      data: {
        originalNotificationId: notificationId,
        acceptanceMessage,
        doctorName,
        patientName: 'Mock Patient'
      }
    };

    await sendNotification(acceptanceNotification);
    
    // Simulate updating appointment status
    console.log('Mock: Updating appointment status to scheduled');
    
    console.log('Mock: Appointment request accepted:', appointmentId);
  } catch (error) {
    console.error('Mock: Error accepting appointment:', error);
    throw new Error('Failed to accept appointment: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

/**
 * Doctor rejects appointment request (Mock Implementation)
 */
export const rejectAppointmentRequest = async (
  notificationId: string,
  appointmentId: string,
  doctorId: string,
  doctorName: string,
  rejectionReason: string
): Promise<void> => {
  try {
    console.log('Mock: Rejecting appointment request', notificationId, appointmentId);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Simulate updating the original notification
    console.log('Mock: Updating original notification status to rejected');
    
    // Simulate sending rejection notification back to health center
    const rejectionNotification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt' | 'status'> = {
      type: 'appointment_rejected',
      title: 'Consultation Request Declined',
      message: `Dr. ${doctorName} is unable to accept the consultation request. Reason: ${rejectionReason}`,
      fromUserId: doctorId,
      fromUserName: doctorName,
      fromUserRole: 'doctor',
      toUserId: 'mock-health-center-id',
      toUserRole: 'health_center',
      appointmentId,
      patientId: 'mock-patient-id',
      doctorId,
      healthCenterId: 'mock-health-center-id',
      priority: 'normal',
      data: {
        originalNotificationId: notificationId,
        rejectionReason,
        doctorName,
        patientName: 'Mock Patient'
      }
    };

    await sendNotification(rejectionNotification);
    
    // Simulate updating appointment status
    console.log('Mock: Updating appointment status to cancelled');
    
    console.log('Mock: Appointment request rejected:', appointmentId);
  } catch (error) {
    console.error('Mock: Error rejecting appointment:', error);
    throw new Error('Failed to reject appointment: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

/**
 * Listen to real-time notifications for a user (Mock Implementation)
 */
export const listenToUserNotifications = (
  userId: string,
  callback: (notifications: Notification[]) => void
): (() => void) => {
  console.log('Mock: Setting up listener for user notifications', userId);
  
  // Simulate real-time updates with mock data
  const mockNotifications: Notification[] = [
    {
      id: 'mock-notification-1',
      type: 'consultation_started',
      title: 'Video Consultation Started',
      message: 'Your video consultation with Dr. Smith has started',
      fromUserId: 'mock-doctor-id',
      fromUserName: 'Dr. Smith',
      fromUserRole: 'doctor',
      toUserId: userId,
      toUserRole: 'health_center',
      appointmentId: 'mock-appointment-id',
      status: 'pending',
      priority: 'normal',
      data: {
        patientName: 'John Doe'
      },
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date())
    }
  ];
  
  callback(mockNotifications);
  
  // Return unsubscribe function
  return () => {
    console.log('Mock: Unsubscribed from user notifications listener');
  };
};

/**
 * Listen to pending appointment requests for a doctor (Mock Implementation)
 */
export const listenToDoctorAppointmentRequests = (
  doctorId: string,
  callback: (requests: Notification[]) => void
): (() => void) => {
  console.log('Mock: Setting up listener for doctor appointment requests', doctorId);
  
  // Simulate real-time updates with mock data
  const mockRequests: Notification[] = [
    {
      id: 'mock-request-1',
      type: 'appointment_request',
      title: 'Urgent Consultation Request',
      message: 'Rural Health Center requests urgent consultation for patient Jane Smith',
      fromUserId: 'mock-health-center-id',
      fromUserName: 'Rural Health Center',
      fromUserRole: 'health_center',
      toUserId: doctorId,
      toUserRole: 'doctor',
      appointmentId: 'mock-appointment-id-2',
      patientId: 'mock-patient-id-2',
      doctorId: doctorId,
      healthCenterId: 'mock-health-center-id',
      status: 'pending',
      priority: 'urgent',
      data: {
        patientName: 'Jane Smith',
        symptoms: 'Severe headache and dizziness',
        requestedTime: new Date().toISOString(),
        healthCenterName: 'Rural Health Center'
      },
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date())
    }
  ];
  
  callback(mockRequests);
  
  // Return unsubscribe function
  return () => {
    console.log('Mock: Unsubscribed from doctor appointment requests listener');
  };
};

/**
 * Mark notification as read (Mock Implementation)
 */
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    console.log('Mock: Marking notification as read', notificationId);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log('Mock: Notification marked as read');
  } catch (error) {
    console.error('Mock: Error marking notification as read:', error);
    throw new Error('Failed to mark notification as read: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

/**
 * Send consultation started notification (Mock Implementation)
 */
export const sendConsultationStartedNotification = async (
  appointmentId: string,
  doctorId: string,
  doctorName: string,
  patientId: string,
  patientName: string,
  healthCenterId: string
): Promise<void> => {
  const notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt' | 'status'> = {
    type: 'consultation_started',
    title: 'Video Consultation Started',
    message: `Dr. ${doctorName} has started the video consultation with ${patientName}`,
    fromUserId: doctorId,
    fromUserName: doctorName,
    fromUserRole: 'doctor',
    toUserId: healthCenterId,
    toUserRole: 'health_center',
    appointmentId,
    patientId,
    doctorId,
    healthCenterId,
    priority: 'normal',
    data: {
      doctorName,
      patientName,
      startedAt: new Date().toISOString()
    }
  };

  await sendNotification(notification);
};

/**
 * Get notification counts for a user (Mock Implementation)
 */
export const getNotificationCounts = async (userId: string) => {
  try {
    console.log('Mock: Getting notification counts for user', userId);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Return mock counts
    return {
      total: 5,
      unread: 2,
      pending: 2
    };
  } catch (error) {
    console.error('Mock: Error getting notification counts:', error);
    return { total: 0, unread: 0, pending: 0 };
  }
};

/**
 * Send video call notification (Mock Implementation)
 */
export const sendVideoCallNotification = async (
  type: 'video_call_invitation' | 'video_call_accepted' | 'video_call_ended',
  fromUserId: string,
  fromUserName: string,
  fromUserRole: 'doctor' | 'patient' | 'health_center',
  toUserId: string,
  toUserRole: 'doctor' | 'patient' | 'health_center',
  appointmentId: string,
  callId: string,
  additionalData?: Record<string, any>
): Promise<string> => {
  let title = '';
  let message = '';
  
  switch (type) {
    case 'video_call_invitation':
      title = 'Video Call Invitation';
      message = `${fromUserName} is inviting you to a video call`;
      break;
    case 'video_call_accepted':
      title = 'Video Call Accepted';
      message = `${fromUserName} has accepted your video call`;
      break;
    case 'video_call_ended':
      title = 'Video Call Ended';
      message = `Your video call with ${fromUserName} has ended`;
      break;
  }

  const notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt' | 'status'> = {
    type,
    title,
    message,
    fromUserId,
    fromUserName,
    fromUserRole,
    toUserId,
    toUserRole,
    appointmentId,
    priority: 'normal',
    data: {
      callId,
      ...additionalData
    }
  };

  return await sendNotification(notification);
};

// Export type for external use