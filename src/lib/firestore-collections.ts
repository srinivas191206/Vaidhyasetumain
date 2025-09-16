// Firestore Collections and Data Models
import { 
  collection, 
  doc, 
  addDoc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  increment,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

// Type definitions for our collections
export interface Patient {
  id?: string;
  name: string;
  age: number;
  contact: string;
  healthCenterId: string;
  address?: string;
  medicalHistory?: string;
  allergies?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Appointment {
  id?: string;
  patientId: string;
  doctorId: string;
  healthCenterId: string;
  time: Timestamp;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  videoRoomId: string;
  notes?: string;
  symptoms?: string;
  urgency: 'normal' | 'urgent' | 'emergency';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Prescription {
  id?: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  healthCenterId: string;
  pdfUrl?: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  notes: string;
  createdAt: Timestamp;
}

export interface Feedback {
  id?: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  healthCenterId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Timestamp;
}

export interface Doctor {
  id?: string;
  name: string;
  specialty: string;
  hospital: string;
  email: string;
  phone: string;
  averageRating: number;
  totalRatings: number;
  status: 'available' | 'busy' | 'offline';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface HealthCenter {
  id?: string;
  name: string;
  location: string;
  phone: string;
  capacity: number;
  staffCount: number;
  createdAt: Timestamp;
}

// Collection references
export const patientsCollection = collection(db, 'patients');
export const appointmentsCollection = collection(db, 'appointments');
export const prescriptionsCollection = collection(db, 'prescriptions');
export const feedbackCollection = collection(db, 'feedback');
export const doctorsCollection = collection(db, 'doctors');
export const healthCentersCollection = collection(db, 'healthCenters');

// Utility function to generate video room ID
export const generateVideoRoomId = (): string => {
  return `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};