// Mock Firestore Collections and Data Models
// This replaces the actual Firestore collections with mock implementations

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
} from '@/lib/firebase';

// Type definitions for our collections (keeping the same structure)
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

// Mock Collection references (using the mock collection function)
export const patientsCollection = collection({} as any, 'patients');
export const appointmentsCollection = collection({} as any, 'appointments');
export const prescriptionsCollection = collection({} as any, 'prescriptions');
export const feedbackCollection = collection({} as any, 'feedback');
export const doctorsCollection = collection({} as any, 'doctors');
export const healthCentersCollection = collection({} as any, 'healthCenters');

// Utility function to generate video room ID
export const generateVideoRoomId = (): string => {
  return `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};