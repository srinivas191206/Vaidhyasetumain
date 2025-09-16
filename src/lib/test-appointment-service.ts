import { collection, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { generateCallId } from '@/lib/webrtc-video-call';

export interface TestAppointment {
  id: string;
  doctorId: string;
  patientId: string;
  doctorName: string;
  patientName: string;
  scheduledTime: Date;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  videoRoomId?: string;
  createdAt: Date;
}

/**
 * Create a test appointment for video call testing
 */
export const createTestAppointment = async (
  doctorId: string,
  patientId: string,
  doctorName: string = 'Dr. Smith',
  patientName: string = 'John Doe'
): Promise<TestAppointment> => {
  const appointmentId = `test_appointment_${Date.now()}`;
  const videoRoomId = generateCallId(appointmentId);
  
  const appointment: TestAppointment = {
    id: appointmentId,
    doctorId,
    patientId,
    doctorName,
    patientName,
    scheduledTime: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
    status: 'scheduled',
    videoRoomId,
    createdAt: new Date()
  };

  try {
    await setDoc(doc(db, 'appointments', appointmentId), {
      ...appointment,
      scheduledTime: serverTimestamp(),
      createdAt: serverTimestamp()
    });

    console.log('Test appointment created:', appointmentId);
    return appointment;
  } catch (error) {
    console.error('Error creating test appointment:', error);
    throw error;
  }
};

/**
 * Get appointment by ID
 */
export const getAppointment = async (appointmentId: string): Promise<TestAppointment | null> => {
  try {
    const appointmentDoc = await getDoc(doc(db, 'appointments', appointmentId));
    
    if (!appointmentDoc.exists()) {
      return null;
    }

    const data = appointmentDoc.data();
    return {
      id: appointmentDoc.id,
      doctorId: data.doctorId,
      patientId: data.patientId,
      doctorName: data.doctorName,
      patientName: data.patientName,
      scheduledTime: data.scheduledTime?.toDate() || new Date(),
      status: data.status,
      videoRoomId: data.videoRoomId,
      createdAt: data.createdAt?.toDate() || new Date()
    };
  } catch (error) {
    console.error('Error getting appointment:', error);
    return null;
  }
};

/**
 * Generate test user IDs and appointment data
 */
export const generateTestData = () => {
  const timestamp = Date.now();
  return {
    doctorId: `doctor_${timestamp}`,
    patientId: `patient_${timestamp}`,
    appointmentId: `test_appointment_${timestamp}`,
    doctorName: 'Dr. Sarah Wilson',
    patientName: 'John Doe'
  };
};

/**
 * Quick setup for testing - creates appointment and returns all necessary data
 */
export const setupVideoCallTest = async () => {
  const testData = generateTestData();
  
  const appointment = await createTestAppointment(
    testData.doctorId,
    testData.patientId,
    testData.doctorName,
    testData.patientName
  );

  return {
    appointment,
    doctorTestConfig: {
      appointmentId: appointment.id,
      userId: testData.doctorId,
      userRole: 'doctor' as const,
      patientName: testData.patientName,
      doctorName: testData.doctorName
    },
    patientTestConfig: {
      appointmentId: appointment.id,
      userId: testData.patientId,
      userRole: 'patient' as const,
      patientName: testData.patientName,
      doctorName: testData.doctorName
    }
  };
};