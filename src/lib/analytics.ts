// Firebase Analytics integration for Vaidhya Setu telemedicine platform
import { analytics } from './firebase';
import { logEvent } from 'firebase/analytics';

// Analytics event types for telemedicine platform
export const trackEvent = {
  // User authentication events
  userLogin: (userRole: 'doctor' | 'patient' | 'health_center') => {
    if (analytics) {
      logEvent(analytics, 'login', {
        user_role: userRole,
        platform: 'vaidhya_setu'
      });
    }
  },

  // Video consultation events
  videoCallStarted: (appointmentId: string, userRole: string) => {
    if (analytics) {
      logEvent(analytics, 'video_call_started', {
        appointment_id: appointmentId,
        user_role: userRole,
        feature: 'webrtc_consultation'
      });
    }
  },

  videoCallEnded: (appointmentId: string, duration: number) => {
    if (analytics) {
      logEvent(analytics, 'video_call_ended', {
        appointment_id: appointmentId,
        call_duration: duration,
        feature: 'webrtc_consultation'
      });
    }
  },

  // Appointment events
  appointmentRequested: (healthCenterId: string, specialization: string) => {
    if (analytics) {
      logEvent(analytics, 'appointment_requested', {
        health_center_id: healthCenterId,
        specialization: specialization,
        feature: 'consultation_request'
      });
    }
  },

  appointmentAccepted: (doctorId: string, appointmentId: string) => {
    if (analytics) {
      logEvent(analytics, 'appointment_accepted', {
        doctor_id: doctorId,
        appointment_id: appointmentId,
        feature: 'consultation_management'
      });
    }
  },

  // Platform usage events
  portalSelected: (portalType: 'specialist' | 'rural_center') => {
    if (analytics) {
      logEvent(analytics, 'portal_selected', {
        portal_type: portalType,
        platform: 'vaidhya_setu'
      });
    }
  },

  // Emergency consultation events
  emergencyConsultation: (urgencyLevel: 'high' | 'medium' | 'low') => {
    if (analytics) {
      logEvent(analytics, 'emergency_consultation', {
        urgency_level: urgencyLevel,
        feature: 'emergency_care'
      });
    }
  },

  // Prescription events
  prescriptionCreated: (doctorId: string, patientId: string) => {
    if (analytics) {
      logEvent(analytics, 'prescription_created', {
        doctor_id: doctorId,
        patient_id: patientId,
        feature: 'digital_prescription'
      });
    }
  },

  // Medicine inventory events
  medicineRequested: (healthCenterId: string, urgencyLevel: string) => {
    if (analytics) {
      logEvent(analytics, 'medicine_requested', {
        health_center_id: healthCenterId,
        urgency_level: urgencyLevel,
        feature: 'inventory_management'
      });
    }
  }
};

// Page view tracking
export const trackPageView = (pageName: string, userRole?: string) => {
  if (analytics) {
    logEvent(analytics, 'page_view', {
      page_name: pageName,
      user_role: userRole || 'anonymous',
      platform: 'vaidhya_setu'
    });
  }
};

// Error tracking
export const trackError = (errorMessage: string, errorContext: string) => {
  if (analytics) {
    logEvent(analytics, 'app_error', {
      error_message: errorMessage,
      error_context: errorContext,
      platform: 'vaidhya_setu'
    });
  }
};