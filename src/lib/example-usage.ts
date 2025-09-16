// Complete Example Usage of Firestore Services
import { Timestamp } from 'firebase/firestore';

// Import all services
import { 
  addPatientAndAppointment,
  listenToDoctorAppointments,
  updateAppointmentStatus
} from './patient-appointment-service';

import { 
  createPrescription,
  getPatientPrescriptions
} from './prescription-service';

import { 
  submitPatientFeedback,
  getDoctorStatistics
} from './feedback-service';

import { 
  VideoCallFactory,
  checkWebRTCSupport,
  getUserMedia
} from './video-call-service';

/**
 * Example 1: Health Center registers patient and creates appointment
 */
export const exampleHealthCenterWorkflow = async () => {
  try {
    console.log('=== Health Center Workflow Example ===');

    // Patient registration data
    const patientData = {
      name: 'Rahul Kumar',
      age: 35,
      contact: '+91 98765 43210',
      address: 'Village Kumarganj, Rajasthan',
      medicalHistory: 'Diabetes, Hypertension',
      allergies: 'Penicillin'
    };

    // Appointment data
    const appointmentData = {
      doctorId: 'doctor_123',
      time: Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)), // Tomorrow
      symptoms: 'Chest pain, shortness of breath',
      urgency: 'urgent' as const,
      notes: 'Patient experiencing chest discomfort for 2 hours'
    };

    // Create patient and appointment
    const result = await addPatientAndAppointment(
      patientData,
      appointmentData,
      'health_center_rajasthan_001'
    );

    console.log('Patient and appointment created:', result);
    console.log('Video Room ID for consultation:', result.videoRoomId);

    return result;
  } catch (error) {
    console.error('Health center workflow error:', error);
    throw error;
  }
};

/**
 * Example 2: Doctor listens to real-time appointments
 */
export const exampleDoctorDashboard = () => {
  console.log('=== Doctor Dashboard Real-time Example ===');

  const doctorId = 'doctor_123';

  // Listen to real-time appointments
  const unsubscribe = listenToDoctorAppointments(doctorId, (appointments) => {
    console.log(`Doctor ${doctorId} has ${appointments.length} active appointments:`);
    
    appointments.forEach(appointment => {
      console.log(`
        Patient ID: ${appointment.patientId}
        Time: ${appointment.time.toDate().toLocaleString()}
        Status: ${appointment.status}
        Urgency: ${appointment.urgency}
        Video Room: ${appointment.videoRoomId}
        Symptoms: ${appointment.symptoms}
      `);
    });
  });

  // Return unsubscribe function for cleanup
  return unsubscribe;
};

/**
 * Example 3: Doctor creates prescription with file upload
 */
export const examplePrescriptionCreation = async (appointmentId: string, file?: File) => {
  try {
    console.log('=== Prescription Creation Example ===');

    const prescriptionData = {
      appointmentId,
      patientId: 'patient_456',
      doctorId: 'doctor_123',
      medications: [
        {
          name: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily',
          duration: '3 months'
        },
        {
          name: 'Amlodipine',
          dosage: '5mg',
          frequency: 'Once daily',
          duration: '3 months'
        }
      ],
      notes: 'Continue medication as prescribed. Follow up in 3 months. Monitor blood sugar levels daily.'
    };

    const prescriptionId = await createPrescription(prescriptionData, file);
    console.log('Prescription created with ID:', prescriptionId);

    return prescriptionId;
  } catch (error) {
    console.error('Prescription creation error:', error);
    throw error;
  }
};

/**
 * Example 4: Patient submits feedback
 */
export const examplePatientFeedback = async (appointmentId: string) => {
  try {
    console.log('=== Patient Feedback Example ===');

    const feedbackData = {
      appointmentId,
      patientId: 'patient_456',
      doctorId: 'doctor_123',
      rating: 5,
      comment: 'Excellent consultation! Dr. was very professional and helpful. The video call quality was great and I received clear medication instructions.'
    };

    const feedbackId = await submitPatientFeedback(feedbackData);
    console.log('Feedback submitted with ID:', feedbackId);

    // Get updated doctor statistics
    const stats = await getDoctorStatistics('doctor_123');
    console.log('Updated doctor statistics:', stats);

    return feedbackId;
  } catch (error) {
    console.error('Feedback submission error:', error);
    throw error;
  }
};

/**
 * Example 5: WebRTC Video Call
 */
export const exampleWebRTCCall = async (videoRoomId: string, appointmentId: string) => {
  try {
    console.log('=== WebRTC Video Call Example ===');

    // Check browser compatibility
    if (!checkWebRTCSupport()) {
      throw new Error('WebRTC is not supported in this browser');
    }

    // Create WebRTC call manager
    const callManager = VideoCallFactory.createWebRTCCall(videoRoomId, appointmentId);

    // Initialize call
    await callManager.initializeCall();
    console.log('WebRTC call initialized');

    // Get local stream for UI
    const localStream = callManager.getLocalStream();
    if (localStream) {
      // Attach to video element in your UI
      const localVideo = document.getElementById('local-video') as HTMLVideoElement;
      if (localVideo) {
        localVideo.srcObject = localStream;
      }
    }

    // For demonstration - create offer (initiator)
    const offer = await callManager.createOffer();
    console.log('Call offer created:', offer);

    // In a real app, you would send this offer to the remote peer
    // and handle the answer through your signaling mechanism

    return callManager;
  } catch (error) {
    console.error('WebRTC call error:', error);
    throw error;
  }
};

/**
 * Example 6: Agora Video Call
 */
export const exampleAgoraCall = async (videoRoomId: string, appointmentId: string, userId: string) => {
  try {
    console.log('=== Agora Video Call Example ===');

    // Create Agora call manager
    const callManager = VideoCallFactory.createAgoraCall(videoRoomId, appointmentId, userId);

    // Initialize Agora SDK
    await callManager.initializeAgora();
    console.log('Agora SDK initialized');

    // Join channel (token should be generated server-side in production)
    await callManager.joinChannel(); // Pass token as parameter in production
    console.log('Joined Agora channel');

    // Get local tracks for UI
    const localVideoTrack = callManager.getLocalVideoTrack();
    if (localVideoTrack) {
      // Play local video in your UI element
      const localVideoElement = document.getElementById('local-video');
      if (localVideoElement) {
        localVideoTrack.play(localVideoElement);
      }
    }

    return callManager;
  } catch (error) {
    console.error('Agora call error:', error);
    
    if (error instanceof Error && error.message.includes('agora-rtc-sdk-ng')) {
      console.log('To use Agora, install the SDK: npm install agora-rtc-sdk-ng');
    }
    
    throw error;
  }
};

/**
 * Example 7: Complete consultation workflow
 */
export const exampleCompleteConsultationWorkflow = async () => {
  try {
    console.log('=== Complete Consultation Workflow ===');

    // Step 1: Health center creates patient and appointment
    const { appointmentId, videoRoomId } = await exampleHealthCenterWorkflow();

    // Step 2: Doctor starts video consultation
    const callManager = await exampleWebRTCCall(videoRoomId, appointmentId);

    // Step 3: During consultation, update appointment status
    await updateAppointmentStatus(appointmentId, 'in-progress');
    console.log('Appointment status updated to in-progress');

    // Simulate consultation duration
    console.log('Consultation in progress...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 4: Doctor creates prescription
    await examplePrescriptionCreation(appointmentId);

    // Step 5: End video call and update appointment
    await callManager.endCall();
    console.log('Video call ended, appointment marked as completed');

    // Step 6: Patient provides feedback
    await examplePatientFeedback(appointmentId);

    console.log('=== Consultation workflow completed successfully ===');

    return {
      appointmentId,
      videoRoomId,
      status: 'completed'
    };
  } catch (error) {
    console.error('Complete workflow error:', error);
    throw error;
  }
};

/**
 * Example 8: Get patient medical records
 */
export const examplePatientRecords = async (patientId: string) => {
  try {
    console.log('=== Patient Records Example ===');

    // Get patient prescriptions
    const prescriptions = await getPatientPrescriptions(patientId);
    console.log(`Found ${prescriptions.length} prescriptions for patient ${patientId}`);

    prescriptions.forEach((prescription, index) => {
      console.log(`
        Prescription ${index + 1}:
        - Appointment: ${prescription.appointmentId}
        - Doctor: ${prescription.doctorId}
        - Medications: ${prescription.medications.length}
        - PDF: ${prescription.pdfUrl ? 'Available' : 'Not available'}
        - Created: ${prescription.createdAt.toDate().toLocaleDateString()}
      `);
    });

    return prescriptions;
  } catch (error) {
    console.error('Patient records error:', error);
    throw error;
  }
};

// Export all examples for easy testing
export const telemedicineExamples = {
  healthCenterWorkflow: exampleHealthCenterWorkflow,
  doctorDashboard: exampleDoctorDashboard,
  prescriptionCreation: examplePrescriptionCreation,
  patientFeedback: examplePatientFeedback,
  webRTCCall: exampleWebRTCCall,
  agoraCall: exampleAgoraCall,
  completeWorkflow: exampleCompleteConsultationWorkflow,
  patientRecords: examplePatientRecords,
};

// Development helper - run examples in console
if (import.meta.env.DEV) {
  (window as any).telemedicineExamples = telemedicineExamples;
  console.log('Telemedicine examples available in window.telemedicineExamples');
}