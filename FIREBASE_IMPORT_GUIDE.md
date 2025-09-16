# Firebase Import Guide

## Correct Import Pattern

All Firebase services should be imported using the path alias configuration:

```typescript
// ✅ CORRECT - Use this pattern in all components
import { db, auth, storage } from '@/lib/firebase';

// Import additional Firebase functions as needed
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut 
} from 'firebase/auth';

import { 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';

import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
```

## Incorrect Patterns (Do NOT use)

```typescript
// ❌ WRONG - Don't import the SDK functions from our config file
import { initializeApp, getAuth, getFirestore } from '@/lib/firebase';

// ❌ WRONG - Don't use relative paths
import { auth, db, storage } from '../lib/firebase';
import { auth, db, storage } from '../../lib/firebase';

// ❌ WRONG - Don't import Firebase SDK directly in components
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
```

## Path Alias Configuration

The project is already configured with the `@/*` path alias:

- **tsconfig.json**: `"@/*": ["./src/*"]`
- **vite.config.ts**: `"@": path.resolve(__dirname, "./src")`

This allows you to use `@/lib/firebase` from any component regardless of its location in the folder structure.

## Usage Examples

### Authentication
```typescript
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};
```

### Firestore Database
```typescript
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore';

const savePatientData = async (patientData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'patients'), patientData);
    return docRef.id;
  } catch (error) {
    console.error('Error saving patient data:', error);
    throw error;
  }
};
```

### Storage
```typescript
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const uploadMedicalFile = async (file: File, fileName: string) => {
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
```