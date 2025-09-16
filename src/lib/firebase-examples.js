// Example usage of Firebase in portals
// Import Firebase services in any component where needed

// ✅ CORRECT - Always use the path alias for consistency:
import { auth, db, storage } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// NOTE: Use this same import pattern in ALL components (.tsx, .jsx, .ts, .js)

// Example: Authentication usage
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

// Example: Firestore usage - Save patient data
export const savePatientData = async (patientData) => {
  try {
    const docRef = await addDoc(collection(db, 'patients'), patientData);
    return docRef.id;
  } catch (error) {
    console.error('Error saving patient data:', error);
    throw error;
  }
};

// Example: Storage usage - Upload medical files
export const uploadMedicalFile = async (file, fileName) => {
  try {
    const storageRef = ref(storage, `medical-files/${fileName}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};