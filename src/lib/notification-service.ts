// Real-time Notification Service for Doctor-Patient Sync
import { 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  onSnapshot,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  collection,
  orderBy,
  limit,
  Timestamp,
  FieldValue
} from 'firebase/firestore';
import { db, messaging } from '@/lib/firebase';
import { isSupported, getToken } from 'firebase/messaging';

// Notification types
export type NotificationType = 
  | 'appointment_request' 
  | 'appointment_accepted' 
  | 'appointment_rejected'
  | 'consultation_started'
  | 'consultation_completed'
  | 'prescription_ready'
  | 'feedback_request'
  | 'emergency_alert';

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
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
  expiresAt?: Timestamp; // For time-sensitive notifications
}

// Firestore collections
const notificationsCollection = collection(db, 'notifications');

/**
 * Send a push notification using Firebase Messaging
 */
async function sendPushNotification(notification: Omit<Notification, 'id'>): Promise<void> {
  // Only send push notifications in browser environment
  if (typeof window === 'undefined' || !messaging) {
    return;
  }

  try {
    // Check if Firebase Messaging is supported
    if (!(await isSupported())) {
      console.warn('Firebase Messaging is not supported in this browser');
      return;
    }

    // In a real application, you would send this to your server
    // which would then use the FCM HTTP API to send the push notification
    console.log('Would send push notification:', notification.title, notification.message);
    
    // For demonstration purposes, we're just logging
    // In a real implementation, this would make an API call to your backend
    // which would then send the push notification via FCM
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}

/**
 * Send a notification to a user
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

    const docRef = await addDoc(notificationsCollection, notification);
    console.log('Notification sent:', docRef.id);
    
    // Send push notification
    await sendPushNotification(notification);
    
    return docRef.id;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw new Error('Failed to send notification');
  }
};

/**
 * Send appointment request notification from patient/health center to doctor
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
 * Doctor accepts appointment request
 */
export const acceptAppointmentRequest = async (
  notificationId: string,
  appointmentId: string,
  doctorId: string,
  doctorName: string,
  acceptanceMessage?: string
): Promise<void> => {
  try {
    // Update the original notification
    await updateDoc(doc(notificationsCollection, notificationId), {
      status: 'accepted',
      updatedAt: serverTimestamp(),
      data: {
        acceptanceMessage: acceptanceMessage || 'Appointment accepted by doctor',
        acceptedAt: new Date().toISOString()
      }
    });

    // Get the original notification to send response
    const originalNotification = await getDoc(doc(notificationsCollection, notificationId));
    const notificationData = originalNotification.data() as Notification;

    // Send acceptance notification back to health center and patient
    const acceptanceNotification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt' | 'status'> = {
      type: 'appointment_accepted',
      title: 'Consultation Accepted',
      message: `Dr. ${doctorName} has accepted the consultation request for ${notificationData.data?.patientName}. ${acceptanceMessage || 'Please prepare the patient for the video consultation.'}`,
      fromUserId: doctorId,
      fromUserName: doctorName,
      fromUserRole: 'doctor',
      toUserId: notificationData.fromUserId,
      toUserRole: 'health_center',
      appointmentId,
      patientId: notificationData.patientId,
      doctorId,
      healthCenterId: notificationData.healthCenterId,
      priority: 'normal',
      data: {
        originalNotificationId: notificationId,
        acceptanceMessage,
        doctorName,
        patientName: notificationData.data?.patientName
      }
    };

    await sendNotification(acceptanceNotification);

    // Update appointment status
    const { updateAppointmentStatus } = await import('./patient-appointment-service');
    await updateAppointmentStatus(appointmentId, 'scheduled');

    console.log('Appointment request accepted:', appointmentId);
  } catch (error) {
    console.error('Error accepting appointment:', error);
    throw new Error('Failed to accept appointment');
  }
};

/**
 * Doctor rejects appointment request
 */
export const rejectAppointmentRequest = async (
  notificationId: string,
  appointmentId: string,
  doctorId: string,
  doctorName: string,
  rejectionReason: string
): Promise<void> => {
  try {
    // Update the original notification
    await updateDoc(doc(notificationsCollection, notificationId), {
      status: 'rejected',
      updatedAt: serverTimestamp(),
      data: {
        rejectionReason,
        rejectedAt: new Date().toISOString()
      }
    });

    // Get the original notification to send response
    const originalNotification = await getDoc(doc(notificationsCollection, notificationId));
    const notificationData = originalNotification.data() as Notification;

    // Send rejection notification back to health center
    const rejectionNotification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt' | 'status'> = {
      type: 'appointment_rejected',
      title: 'Consultation Request Declined',
      message: `Dr. ${doctorName} is unable to accept the consultation request for ${notificationData.data?.patientName}. Reason: ${rejectionReason}`,
      fromUserId: doctorId,
      fromUserName: doctorName,
      fromUserRole: 'doctor',
      toUserId: notificationData.fromUserId,
      toUserRole: 'health_center',
      appointmentId,
      patientId: notificationData.patientId,
      doctorId,
      healthCenterId: notificationData.healthCenterId,
      priority: 'normal',
      data: {
        originalNotificationId: notificationId,
        rejectionReason,
        doctorName,
        patientName: notificationData.data?.patientName
      }
    };

    await sendNotification(rejectionNotification);

    // Update appointment status
    const { updateAppointmentStatus } = await import('./patient-appointment-service');
    await updateAppointmentStatus(appointmentId, 'cancelled');

    console.log('Appointment request rejected:', appointmentId);
  } catch (error) {
    console.error('Error rejecting appointment:', error);
    throw new Error('Failed to reject appointment');
  }
};

/**
 * Listen to real-time notifications for a user
 */
export const listenToUserNotifications = (
  userId: string,
  callback: (notifications: Notification[]) => void
): (() => void) => {
  const q = query(
    notificationsCollection,
    where('toUserId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(50)
  );

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const notifications: Notification[] = [];
      querySnapshot.forEach((doc) => {
        notifications.push({
          id: doc.id,
          ...doc.data(),
        } as Notification);
      });
      
      console.log('Real-time notifications update for user:', userId);
      callback(notifications);
    },
    (error) => {
      console.error('Error listening to notifications:', error);
    }
  );

  return unsubscribe;
};

/**
 * Listen to pending appointment requests for a doctor
 */
export const listenToDoctorAppointmentRequests = (
  doctorId: string,
  callback: (requests: Notification[]) => void
): (() => void) => {
  const q = query(
    notificationsCollection,
    where('toUserId', '==', doctorId),
    where('type', '==', 'appointment_request'),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const requests: Notification[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Notification;
        // Check if notification hasn't expired
        if (!data.expiresAt || data.expiresAt.toDate() > new Date()) {
          requests.push({
            id: doc.id,
            ...data,
          });
        }
      });
      
      console.log('Real-time appointment requests for doctor:', doctorId, requests.length);
      callback(requests);
    },
    (error) => {
      console.error('Error listening to appointment requests:', error);
    }
  );

  return unsubscribe;
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    await updateDoc(doc(notificationsCollection, notificationId), {
      status: 'read',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw new Error('Failed to mark notification as read');
  }
};

/**
 * Send consultation started notification
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
 * Get notification counts for a user
 */
export const getNotificationCounts = async (userId: string) => {
  try {
    const q = query(
      notificationsCollection,
      where('toUserId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    let unreadCount = 0;
    let pendingCount = 0;
    let totalCount = querySnapshot.size;

    querySnapshot.forEach((doc) => {
      const data = doc.data() as Notification;
      if (data.status === 'pending') {
        unreadCount++;
        pendingCount++;
      } else if (data.status === 'read') {
        // Already read
      } else {
        unreadCount++;
      }
    });

    return {
      total: totalCount,
      unread: unreadCount,
      pending: pendingCount
    };
  } catch (error) {
    console.error('Error getting notification counts:', error);
    return { total: 0, unread: 0, pending: 0 };
  }
};

// Export type for external use