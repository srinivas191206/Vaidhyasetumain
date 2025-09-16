// Patient and Appointment Management Functions
import { 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  onSnapshot,
  updateDoc,
  doc,
  getDoc
} from 'firebase/firestore';
import { 
  patientsCollection, 
  appointmentsCollection, 
  generateVideoRoomId,
  type Patient,
  type Appointment 
} from './firestore-collections';

/**
 * Add a new patient from Health Center
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

    const docRef = await addDoc(patientsCollection, newPatient);
    console.log('Patient added successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding patient:', error);
    throw new Error('Failed to add patient');
  }
};

/**
 * Create a new appointment
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

    const docRef = await addDoc(appointmentsCollection, newAppointment);
    console.log('Appointment created successfully with ID:', docRef.id);
    console.log('Video Room ID:', videoRoomId);
    return docRef.id;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw new Error('Failed to create appointment');
  }
};

/**
 * Add patient and create appointment in one operation (for Health Center workflow)
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
    // Add patient first
    const patientId = await addNewPatient(patientData, healthCenterId);

    // Create appointment with the new patient ID
    const appointmentId = await createAppointment({
      patientId,
      healthCenterId,
      ...appointmentData,
    });

    // Get the video room ID from the created appointment
    const appointmentDoc = await getDoc(doc(appointmentsCollection, appointmentId));
    const appointment = appointmentDoc.data() as Appointment;

    return {
      patientId,
      appointmentId,
      videoRoomId: appointment.videoRoomId,
    };
  } catch (error) {
    console.error('Error in addPatientAndAppointment:', error);
    throw new Error('Failed to add patient and create appointment');
  }
};

/**
 * Listen to real-time appointments for a specific doctor
 * @param doctorId - Doctor's ID
 * @param callback - Function to handle appointment updates
 * @returns Unsubscribe function
 */
export const listenToDoctorAppointments = (
  doctorId: string,
  callback: (appointments: Appointment[]) => void
) => {
  const q = query(
    appointmentsCollection,
    where('doctorId', '==', doctorId),
    where('status', 'in', ['scheduled', 'in-progress'])
  );

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const appointments: Appointment[] = [];
      querySnapshot.forEach((doc) => {
        appointments.push({
          id: doc.id,
          ...doc.data(),
        } as Appointment);
      });
      
      // Sort by appointment time
      appointments.sort((a, b) => a.time.seconds - b.time.seconds);
      
      console.log('Real-time appointments update for doctor:', doctorId);
      callback(appointments);
    },
    (error) => {
      console.error('Error listening to appointments:', error);
    }
  );

  return unsubscribe;
};

/**
 * Update appointment status
 * @param appointmentId - Appointment ID
 * @param status - New status
 */
export const updateAppointmentStatus = async (
  appointmentId: string,
  status: Appointment['status']
): Promise<void> => {
  try {
    await updateDoc(doc(appointmentsCollection, appointmentId), {
      status,
      updatedAt: serverTimestamp(),
    });
    console.log(`Appointment ${appointmentId} status updated to ${status}`);
  } catch (error) {
    console.error('Error updating appointment status:', error);
    throw new Error('Failed to update appointment status');
  }
};

/**
 * Get appointments for a health center
 * @param healthCenterId - Health center ID
 * @param callback - Function to handle appointments update
 * @returns Unsubscribe function
 */
export const listenToHealthCenterAppointments = (
  healthCenterId: string,
  callback: (appointments: Appointment[]) => void
) => {
  const q = query(
    appointmentsCollection,
    where('healthCenterId', '==', healthCenterId)
  );

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const appointments: Appointment[] = [];
      querySnapshot.forEach((doc) => {
        appointments.push({
          id: doc.id,
          ...doc.data(),
        } as Appointment);
      });
      
      console.log('Real-time appointments update for health center:', healthCenterId);
      callback(appointments);
    },
    (error) => {
      console.error('Error listening to health center appointments:', error);
    }
  );

  return unsubscribe;
};