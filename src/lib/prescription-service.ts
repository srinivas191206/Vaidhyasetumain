// Prescription Management with File Upload
import { 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  getDocs,
  doc,
  getDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { 
  prescriptionsCollection,
  appointmentsCollection,
  type Prescription,
  type Appointment 
} from './firestore-collections';

/**
 * Upload prescription file to Firebase Storage
 * @param file - PDF file
 * @param appointmentId - Appointment ID for file naming
 * @returns Promise with download URL
 */
export const uploadPrescriptionFile = async (
  file: File,
  appointmentId: string
): Promise<string> => {
  try {
    // Validate file type
    if (file.type !== 'application/pdf') {
      throw new Error('Only PDF files are allowed for prescriptions');
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size must be less than 10MB');
    }

    // Create unique file name
    const timestamp = Date.now();
    const fileName = `prescriptions/${appointmentId}_${timestamp}.pdf`;
    
    // Upload file to Firebase Storage
    const storageRef = ref(storage, fileName);
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('Prescription file uploaded successfully:', fileName);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading prescription file:', error);
    throw new Error('Failed to upload prescription file');
  }
};

/**
 * Create a new prescription with optional file upload
 * @param prescriptionData - Prescription details
 * @param file - Optional PDF file
 * @returns Promise with prescription ID
 */
export const createPrescription = async (
  prescriptionData: Omit<Prescription, 'id' | 'pdfUrl' | 'createdAt'>,
  file?: File
): Promise<string> => {
  try {
    // Get appointment details for validation
    const appointmentDoc = await getDoc(doc(appointmentsCollection, prescriptionData.appointmentId));
    if (!appointmentDoc.exists()) {
      throw new Error('Appointment not found');
    }
    
    const appointment = appointmentDoc.data() as Appointment;
    
    // Validate that the doctor creating prescription matches appointment doctor
    if (appointment.doctorId !== prescriptionData.doctorId) {
      throw new Error('Only the assigned doctor can create prescription for this appointment');
    }

    let pdfUrl: string | undefined;
    
    // Upload file if provided
    if (file) {
      pdfUrl = await uploadPrescriptionFile(file, prescriptionData.appointmentId);
    }

    // Create prescription document
    const newPrescription: Omit<Prescription, 'id'> = {
      ...prescriptionData,
      healthCenterId: appointment.healthCenterId,
      pdfUrl,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(prescriptionsCollection, newPrescription);
    console.log('Prescription created successfully with ID:', docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating prescription:', error);
    throw error;
  }
};

/**
 * Get prescriptions for a patient
 * @param patientId - Patient ID
 * @returns Promise with prescriptions array
 */
export const getPatientPrescriptions = async (patientId: string): Promise<Prescription[]> => {
  try {
    const q = query(
      prescriptionsCollection,
      where('patientId', '==', patientId)
    );
    
    const querySnapshot = await getDocs(q);
    const prescriptions: Prescription[] = [];
    
    querySnapshot.forEach((doc) => {
      prescriptions.push({
        id: doc.id,
        ...doc.data(),
      } as Prescription);
    });
    
    // Sort by creation date (newest first)
    prescriptions.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
    
    return prescriptions;
  } catch (error) {
    console.error('Error getting patient prescriptions:', error);
    throw new Error('Failed to get patient prescriptions');
  }
};

/**
 * Get prescriptions for a doctor
 * @param doctorId - Doctor ID
 * @returns Promise with prescriptions array
 */
export const getDoctorPrescriptions = async (doctorId: string): Promise<Prescription[]> => {
  try {
    const q = query(
      prescriptionsCollection,
      where('doctorId', '==', doctorId)
    );
    
    const querySnapshot = await getDocs(q);
    const prescriptions: Prescription[] = [];
    
    querySnapshot.forEach((doc) => {
      prescriptions.push({
        id: doc.id,
        ...doc.data(),
      } as Prescription);
    });
    
    // Sort by creation date (newest first)
    prescriptions.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
    
    return prescriptions;
  } catch (error) {
    console.error('Error getting doctor prescriptions:', error);
    throw new Error('Failed to get doctor prescriptions');
  }
};

/**
 * Generate prescription PDF content (for client-side PDF generation)
 * @param prescription - Prescription data
 * @param patientName - Patient name
 * @param doctorName - Doctor name
 * @returns HTML content for PDF generation
 */
export const generatePrescriptionHTML = (
  prescription: Prescription,
  patientName: string,
  doctorName: string
): string => {
  const currentDate = new Date().toLocaleDateString();
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Medical Prescription</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .prescription-info { margin: 20px 0; }
        .medications { margin: 20px 0; }
        .medication-item { margin: 10px 0; padding: 10px; border: 1px solid #ddd; }
        .footer { margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Medical Prescription</h1>
        <p>Clinic Pro - Telemedicine Platform</p>
      </div>
      
      <div class="prescription-info">
        <p><strong>Patient:</strong> ${patientName}</p>
        <p><strong>Doctor:</strong> ${doctorName}</p>
        <p><strong>Date:</strong> ${currentDate}</p>
        <p><strong>Prescription ID:</strong> ${prescription.id}</p>
      </div>
      
      <div class="medications">
        <h3>Prescribed Medications:</h3>
        ${prescription.medications.map(med => `
          <div class="medication-item">
            <p><strong>Medicine:</strong> ${med.name}</p>
            <p><strong>Dosage:</strong> ${med.dosage}</p>
            <p><strong>Frequency:</strong> ${med.frequency}</p>
            <p><strong>Duration:</strong> ${med.duration}</p>
          </div>
        `).join('')}
      </div>
      
      ${prescription.notes ? `
        <div class="notes">
          <h3>Additional Notes:</h3>
          <p>${prescription.notes}</p>
        </div>
      ` : ''}
      
      <div class="footer">
        <p><strong>Doctor's Signature:</strong> ${doctorName}</p>
        <p><em>This is a digitally generated prescription from Clinic Pro platform.</em></p>
      </div>
    </body>
    </html>
  `;
};