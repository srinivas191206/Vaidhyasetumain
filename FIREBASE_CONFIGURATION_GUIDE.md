# Firebase Configuration Guide for Vaidhya Setu Telemedicine Platform

## Overview

This guide explains the Firebase configuration for the Vaidhya Setu telemedicine platform. Firebase provides several services that enhance the platform's functionality, including authentication, real-time database, storage, analytics, and messaging.

## Firebase Services Configuration

### 1. Core Configuration

The Firebase configuration is managed through environment variables with the `VITE_` prefix, which makes them available to the client-side application. The configuration is defined in two files:

- [.env](file:///Users/thaladasrinivas/Downloads/telemed-bridge-main/.env) - Contains actual values (not committed to version control)
- [.env.example](file:///Users/thaladasrinivas/Downloads/telemed-bridge-main/.env.example) - Documents required variables (safe to commit)

### 2. Firebase Services Available

#### Authentication (`firebase/auth`)
User authentication for doctors, patients, and health center staff.

#### Firestore Database (`firebase/firestore`)
Real-time data synchronization for appointments, patients, prescriptions, and notifications.

#### Storage (`firebase/storage`)
File uploads for prescriptions, medical documents, and other media.

#### Analytics (`firebase/analytics`)
User behavior tracking and platform usage analytics.

#### Messaging (`firebase/messaging`)
Push notifications for real-time alerts and updates.

## Environment Variables

### Required Variables

```env
# Firebase Core Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

# Firebase Messaging Configuration
VITE_FIREBASE_VAPID_KEY=your_firebase_cloud_messaging_vapid_key
```

### How to Obtain These Values

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project (hackathon-79e80)
3. Click the gear icon next to "Project Overview" and select "Project settings"
4. Under "General" tab, you'll find the Firebase SDK configuration
5. For the VAPID key, go to "Cloud Messaging" tab and copy the "Web push certificates" key

## Firebase Service Initialization

Firebase services are initialized in two files to support both TypeScript and JavaScript usage:

### TypeScript Version ([src/lib/firebase.ts](file:///Users/thaladasrinivas/Downloads/telemed-bridge-main/src/lib/firebase.ts))

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getMessaging, Messaging } from 'firebase/messaging';

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Browser-only services
let analytics: Analytics | null = null;
let messaging: Messaging | null = null;

if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
  
  // Messaging requires service worker support
  if ('serviceWorker' in navigator) {
    messaging = getMessaging(app);
  }
}

// Export services
export { auth, db, storage, analytics, messaging };
export default app;
```

### JavaScript Version ([src/lib/firebase.js](file:///Users/thaladasrinivas/Downloads/telemed-bridge-main/src/lib/firebase.js))

The JavaScript version follows the same pattern with equivalent syntax.

## Firebase Messaging Setup

### Service Worker

Firebase Messaging requires a service worker to handle background messages. The service worker is located at [public/firebase-messaging-sw.js](file:///Users/thaladasrinivas/Downloads/telemed-bridge-main/public/firebase-messaging-sw.js).

### Push Notification Service

A dedicated service ([src/lib/push-notification-service.ts](file:///Users/thaladasrinivas/Downloads/telemed-bridge-main/src/lib/push-notification-service.ts)) provides helper functions for:

1. Requesting notification permissions
2. Getting FCM tokens
3. Listening for foreground messages
4. Showing local notifications

### Usage Example

```typescript
import { initializePushNotifications } from '@/lib/push-notification-service';

// Initialize push notifications when the app starts
initializePushNotifications().then(() => {
  console.log('Push notifications initialized');
});
```

## Security Considerations

### Public Configuration

The Firebase configuration values in the environment variables are not secret. They are visible to all users of the application. Firebase security is handled through:

1. Firestore security rules
2. Firebase Authentication
3. Storage security rules

### Sensitive Data

Never store sensitive server-side secrets in environment variables with the `VITE_` prefix, as they will be exposed to the client.

## Testing Firebase Configuration

### Local Development

1. Ensure all environment variables are set in your [.env](file:///Users/thaladasrinivas/Downloads/telemed-bridge-main/.env) file
2. Start the development server: `npm run dev`
3. Check the browser console for any Firebase initialization errors

### Production Deployment

1. Set environment variables in your deployment platform
2. For Vercel, use the dashboard to set environment variables
3. For Firebase Hosting, use the Firebase Console or CLI

## Troubleshooting

### Common Issues

1. **Firebase not initialized**: Check that all environment variables are set correctly
2. **Messaging not working**: Ensure the service worker is registered and the VAPID key is set
3. **Permission denied**: Check Firestore and Storage security rules

### Debugging Steps

1. Check browser console for errors
2. Verify environment variables are loaded correctly
3. Test Firebase connection with a simple read operation
4. Check network tab for failed Firebase requests

## Best Practices

1. Always use environment variables for configuration
2. Keep [.env](file:///Users/thaladasrinivas/Downloads/telemed-bridge-main/.env) out of version control
3. Document all environment variables in [.env.example](file:///Users/thaladasrinivas/Downloads/telemed-bridge-main/.env.example)
4. Use fallback values for optional configuration
5. Initialize browser-only services conditionally
6. Handle service worker registration properly for messaging