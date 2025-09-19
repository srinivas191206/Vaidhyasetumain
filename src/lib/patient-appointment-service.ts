// Patient and Appointment Management Functions (Mock Implementation)
// This replaces the actual Firestore operations with mock implementations

import { 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  onSnapshot,
  updateDoc,
  doc,
  getDoc
} from '@/lib/firebase';
import { 
  patientsCollection, 
  appointmentsCollection, 
  generateVideoRoomId,
  type Patient,
  type Appointment 
} from './firestore-collections';
import { sendNotification } from '@/lib/notification-service';

/**
 * Add a new patient from Health Center (Mock Implementation)
 * @param patientData - Patient information
 * @param healthCenterId - ID of the health center
 * @returns Promise with patient ID
 */
export const addNewPatient = async (
  patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>,
  healthCenterId: string
): Promise<string> => {
  try {
    const newPatient: Omit<Patient, 'id'> = {
      ...patientData,
      healthCenterId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    console.log('Mock: Adding patient with data:', newPatient);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return a mock patient ID
    const patientId = `mock-patient-${Date.now()}`;
    console.log('Mock: Patient added successfully with ID:', patientId);
    return patientId;
  } catch (error) {
    console.error('Mock: Error adding patient:', error);
    throw new Error('Failed to add patient: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

/**
 * Create a new appointment (Mock Implementation)
 * @param appointmentData - Appointment details
 * @returns Promise with appointment ID
 */
export const createAppointment = async (
  appointmentData: Omit<Appointment, 'id' | 'videoRoomId' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const videoRoomId = generateVideoRoomId();
    
    const newAppointment: Omit<Appointment, 'id'> = {
      ...appointmentData,
      videoRoomId,
      status: 'scheduled',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    console.log('Mock: Creating appointment with data:', newAppointment);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return a mock appointment ID
    const appointmentId = `mock-appointment-${Date.now()}`;
    console.log('Mock: Appointment created successfully with ID:', appointmentId);
    console.log('Mock: Video Room ID:', videoRoomId);
    return appointmentId;
  } catch (error) {
    console.error('Mock: Error creating appointment:', error);
    throw new Error('Failed to create appointment: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

/**
 * Add patient and create appointment in one operation (Mock Implementation)
 * @param patientData - Patient information
 * @param appointmentData - Appointment details
 * @param healthCenterId - Health center ID
 * @returns Promise with both patient and appointment IDs
 */
export const addPatientAndAppointment = async (
  patientData: Omit<Patient, 'id' | 'healthCenterId' | 'createdAt' | 'updatedAt'>,
  appointmentData: Pick<Appointment, 'doctorId' | 'time' | 'symptoms' | 'urgency' | 'notes'>,
  healthCenterId: string
): Promise<{ patientId: string; appointmentId: string; videoRoomId: string }> => {
  try {
    console.log('Mock: Starting addPatientAndAppointment with:', { patientData, appointmentData, healthCenterId });
    
    // Add patient first
    const patientId = await addNewPatient(patientData, healthCenterId);
    console.log('Mock: Patient created with ID:', patientId);

    // Create appointment with the new patient ID
    const appointmentId = await createAppointment({
      patientId,
      healthCenterId,
      ...appointmentData,
    });
    console.log('Mock: Appointment created with ID:', appointmentId);

    // Generate a mock video room ID
    const videoRoomId = generateVideoRoomId();
    console.log('Mock: Video Room ID:', videoRoomId);

    return {
      patientId,
      appointmentId,
      videoRoomId,
    };
  } catch (error) {
    console.error('Mock: Error in addPatientAndAppointment:', error);
    // Provide more specific error information
    if (error instanceof Error) {
      throw new Error(`Failed to add patient and create appointment: ${error.message}`);
    } else {
      throw new Error('Failed to add patient and create appointment due to unknown error');
    }
  }
};

/**
 * Listen to real-time appointments for a specific doctor (Mock Implementation)
 * @param doctorId - Doctor's ID
 * @param callback - Function to handle appointment updates
 * @returns Unsubscribe function
 */
export const listenToDoctorAppointments = (
  doctorId: string,
  callback: (appointments: Appointment[]) => void
) => {
  console.log('Mock: Setting up listener for doctor appointments', doctorId);
  
  // Simulate real-time updates with mock data
  const mockAppointments: Appointment[] = [
    {
      id: 'mock-apt-1',
      patientId: 'mock-patient-1',
      doctorId: doctorId,
      healthCenterId: 'mock-health-center-1',
      time: Timestamp.fromDate(new Date(Date.now() + 3600000)), // 1 hour from now
      status: 'scheduled',
      videoRoomId: 'mock-room-1',
      symptoms: 'Fever and cough',
      urgency: 'normal',
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
      notes: 'Patient reports fever for 3 days'
    }
  ];
  
  callback(mockAppointments);
  
  // Return unsubscribe function
  return () => {
    console.log('Mock: Unsubscribed from doctor appointments listener');
  };
};

/**
 * Update appointment status (Mock Implementation)
 * @param appointmentId - Appointment ID
 * @param status - New status
 */
export const updateAppointmentStatus = async (
  appointmentId: string,
  status: Appointment['status']
): Promise<void> => {
  try {
    console.log(`Mock: Updating appointment ${appointmentId} status to ${status}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Mock: Appointment ${appointmentId} status updated to ${status}`);
    
    // Send notification about status change if needed
    if (status === 'confirmed' || status === 'completed') {
      // In a real implementation, we would send a notification to the patient
      console.log('Mock: Would send notification about appointment status change');
    }
  } catch (error) {
    console.error('Mock: Error updating appointment status:', error);
    throw new Error('Failed to update appointment status: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

/**
 * Get appointments for a health center (Mock Implementation)
 * @param healthCenterId - Health center ID
 * @param callback - Function to handle appointments update
 * @returns Unsubscribe function
 */
export const listenToHealthCenterAppointments = (
  healthCenterId: string,
  callback: (appointments: Appointment[]) => void
) => {
  console.log('Mock: Setting up listener for health center appointments', healthCenterId);
  
  // Simulate real-time updates with mock data
  const mockAppointments: Appointment[] = [
    {
      id: 'mock-apt-2',
      patientId: 'mock-patient-2',
      doctorId: 'mock-doctor-1',
      healthCenterId: healthCenterId,
      time: Timestamp.fromDate(new Date(Date.now() + 7200000)), // 2 hours from now
      status: 'scheduled',
      videoRoomId: 'mock-room-2',
      symptoms: 'Headache and dizziness',
      urgency: 'urgent',
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
      notes: 'Patient reports severe headache'
    }
  ];
  
  callback(mockAppointments);
  
  // Return unsubscribe function
  return () => {
    console.log('Mock: Unsubscribed from health center appointments listener');
  };
};