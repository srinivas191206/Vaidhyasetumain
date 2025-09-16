# Firestore Integration Guide

This guide covers the complete Firestore integration for the Vaidhya Setu telemedicine platform, including collections, services, and video call functionality.

## 📋 Collections Structure

### 1. **patients**
```typescript
{
  id: string;
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
```

### 2. **appointments**
```typescript
{
  id: string;
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
```

### 3. **prescriptions**
```typescript
{
  id: string;
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
```

### 4. **feedback**
```typescript
{
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  healthCenterId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Timestamp;
}
```

## 🚀 Quick Start

### 1. Import Services
```typescript
import { db, auth, storage } from '@/lib/firebase';
import { 
  addPatientAndAppointment,
  listenToDoctorAppointments 
} from '@/lib/patient-appointment-service';
import { createPrescription } from '@/lib/prescription-service';
import { submitPatientFeedback } from '@/lib/feedback-service';
import { VideoCallFactory } from '@/lib/video-call-service';
```

### 2. Health Center: Register Patient & Create Appointment
```typescript
const result = await addPatientAndAppointment(
  {
    name: 'Rahul Kumar',
    age: 35,
    contact: '+91 98765 43210',
    address: 'Village Kumarganj, Rajasthan',
    medicalHistory: 'Diabetes, Hypertension',
    allergies: 'Penicillin'
  },
  {
    doctorId: 'doctor_123',
    time: Timestamp.fromDate(new Date()),
    symptoms: 'Chest pain, shortness of breath',
    urgency: 'urgent',
    notes: 'Patient experiencing chest discomfort'
  },
  'health_center_rajasthan_001'
);

console.log('Video Room ID:', result.videoRoomId);
```

### 3. Doctor: Listen to Real-time Appointments
```typescript
const unsubscribe = listenToDoctorAppointments('doctor_123', (appointments) => {
  console.log('Active appointments:', appointments.length);
  appointments.forEach(apt => {
    console.log(`Patient: ${apt.patientId}, Room: ${apt.videoRoomId}`);
  });
});

// Cleanup when component unmounts
return () => unsubscribe();
```

### 4. Doctor: Create Prescription with File Upload
```typescript
const prescriptionData = {
  appointmentId: 'appointment_123',
  patientId: 'patient_456',
  doctorId: 'doctor_123',
  medications: [
    {
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      duration: '3 months'
    }
  ],
  notes: 'Follow up in 3 months'
};

// With file upload
const prescriptionId = await createPrescription(prescriptionData, pdfFile);
```

### 5. Patient: Submit Feedback
```typescript
const feedbackId = await submitPatientFeedback({
  appointmentId: 'appointment_123',
  patientId: 'patient_456',
  doctorId: 'doctor_123',
  rating: 5,
  comment: 'Excellent consultation! Very professional.'
});
```

## 🎥 Video Call Integration

### WebRTC Option
```typescript
// Check browser support
if (checkWebRTCSupport()) {
  const callManager = VideoCallFactory.createWebRTCCall(videoRoomId, appointmentId);
  
  await callManager.initializeCall();
  
  // Get local stream for UI
  const localStream = callManager.getLocalStream();
  localVideoElement.srcObject = localStream;
  
  // Create offer (for call initiator)
  const offer = await callManager.createOffer();
  
  // End call
  await callManager.endCall();
}
```

### Agora Option (Recommended for Production)
```typescript
// Install: npm install agora-rtc-sdk-ng
const callManager = VideoCallFactory.createAgoraCall(videoRoomId, appointmentId, userId);

await callManager.initializeAgora();
await callManager.joinChannel(token); // Generate token server-side

// Control video/audio
await callManager.toggleVideo();
await callManager.toggleAudio();

// Leave channel
await callManager.leaveChannel();
```

## 🔄 Real-time Features

### 1. Doctor Dashboard Updates
```typescript
// Listen to appointments
const unsubscribe = listenToDoctorAppointments(doctorId, (appointments) => {
  setDoctorAppointments(appointments);
});

// Listen to health center appointments
const unsubscribe2 = listenToHealthCenterAppointments(healthCenterId, (appointments) => {
  setHealthCenterAppointments(appointments);
});
```

### 2. Automatic Rating Updates
```typescript
// When feedback is submitted, doctor rating is automatically updated
await submitPatientFeedback(feedbackData);

// Get updated statistics
const stats = await getDoctorStatistics(doctorId);
console.log('New average rating:', stats.averageRating);
```

## 📱 Integration with Components

### Rural Health Center Dashboard
```typescript
import { addPatientAndAppointment } from '@/lib/patient-appointment-service';

const handlePatientRegistration = async (patientData, appointmentData) => {
  try {
    const result = await addPatientAndAppointment(
      patientData,
      appointmentData,
      healthCenterId
    );
    
    // Update UI with new appointment
    setAppointments(prev => [...prev, result]);
    
    // Show success message
    toast.success(`Patient registered! Video Room: ${result.videoRoomId}`);
  } catch (error) {
    toast.error('Failed to register patient');
  }
};
```

### Specialist Dashboard
```typescript
import { listenToDoctorAppointments } from '@/lib/patient-appointment-service';

useEffect(() => {
  const unsubscribe = listenToDoctorAppointments(doctorId, (appointments) => {
    setActiveAppointments(appointments);
  });
  
  return unsubscribe;
}, [doctorId]);
```

### Video Consultation Component
```typescript
import { VideoCallFactory } from '@/lib/video-call-service';

const VideoConsultation = ({ videoRoomId, appointmentId }) => {
  const [callManager, setCallManager] = useState(null);
  
  const startCall = async () => {
    const manager = VideoCallFactory.createWebRTCCall(videoRoomId, appointmentId);
    await manager.initializeCall();
    setCallManager(manager);
  };
  
  const endCall = async () => {
    if (callManager) {
      await callManager.endCall();
      setCallManager(null);
    }
  };
  
  // ... render video UI
};
```

## 🔒 Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Patients can only read their own data
    match /patients/{patientId} {
      allow read, write: if request.auth != null && 
        resource.data.healthCenterId == getUserHealthCenter();
    }
    
    // Appointments - doctors and health centers can access
    match /appointments/{appointmentId} {
      allow read, write: if request.auth != null && 
        (resource.data.doctorId == request.auth.uid || 
         resource.data.healthCenterId == getUserHealthCenter());
    }
    
    // Prescriptions - read by patient and doctor
    match /prescriptions/{prescriptionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        resource.data.doctorId == request.auth.uid;
    }
    
    // Feedback - patients can write, doctors can read
    match /feedback/{feedbackId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        resource.data.patientId == request.auth.uid;
    }
  }
}
```

## 📦 Required Dependencies

```json
{
  "firebase": "^12.2.1",
  "agora-rtc-sdk-ng": "^4.20.0" // Optional, for Agora integration
}
```

## 🌍 Environment Variables

```env
# Already configured in your .env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Add for Agora (optional)
VITE_AGORA_APP_ID=your_agora_app_id
```

## 🧪 Testing Examples

All examples are available in the browser console during development:

```javascript
// In browser console
window.telemedicineExamples.healthCenterWorkflow();
window.telemedicineExamples.doctorDashboard();
window.telemedicineExamples.completeWorkflow();
```

## 🚀 Production Deployment

1. **Firestore Security Rules**: Deploy the security rules above
2. **Storage Rules**: Configure Firebase Storage security
3. **Agora Token Server**: Implement server-side token generation for Agora
4. **Error Handling**: Add comprehensive error boundaries
5. **Monitoring**: Set up Firebase Analytics and Crashlytics

## 📞 Support

For video call setup:
- **WebRTC**: Built-in browser support, no additional setup needed
- **Agora**: Requires account setup at [Agora.io](https://www.agora.io/)

The platform now supports complete telemedicine workflows with real-time updates, file management, and video consultations!