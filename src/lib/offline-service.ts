import { openDB, DBSchema } from 'idb';

// Define the database schema
interface OfflineDB extends DBSchema {
  patients: {
    key: string;
    value: any;
    indexes: { 'by-name': string };
  };
  appointments: {
    key: string;
    value: any;
    indexes: { 'by-date': string };
  };
}

// Open the database
const dbPromise = openDB<OfflineDB>('telemed-offline-db', 1, {
  upgrade(db) {
    // Create patients store
    const patientStore = db.createObjectStore('patients', { keyPath: 'id' });
    patientStore.createIndex('by-name', 'name');
    
    // Create appointments store
    const appointmentStore = db.createObjectStore('appointments', { keyPath: 'id' });
    appointmentStore.createIndex('by-date', 'date');
  },
});

// Save patient data locally
export async function savePatientOffline(patient: any) {
  const db = await dbPromise;
  await db.put('patients', patient);
}

// Get patient data from local storage
export async function getPatientOffline(id: string) {
  const db = await dbPromise;
  return await db.get('patients', id);
}

// Get all patients from local storage
export async function getAllPatientsOffline() {
  const db = await dbPromise;
  return await db.getAll('patients');
}

// Save appointment data locally
export async function saveAppointmentOffline(appointment: any) {
  const db = await dbPromise;
  await db.put('appointments', appointment);
}

// Get appointment data from local storage
export async function getAppointmentOffline(id: string) {
  const db = await dbPromise;
  return await db.get('appointments', id);
}

// Get all appointments from local storage
export async function getAllAppointmentsOffline() {
  const db = await dbPromise;
  return await db.getAll('appointments');
}

// Check if we're online or offline
export function isOnline() {
  return navigator.onLine;
}

// Sync local data with server when online
export async function syncWithServer() {
  if (!isOnline()) return;
  
  // In a real implementation, you would:
  // 1. Get all local changes
  // 2. Send them to your server
  // 3. Update local data with server responses
  // 4. Handle conflicts
  
  console.log('Syncing with server...');
  // This is a placeholder - implement based on your API
}