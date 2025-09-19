# Vercel Deployment Guide for Vaidhya Setu Telemedicine Platform

## Overview

This guide explains how to properly deploy the Vaidhya Setu telemedicine platform to Vercel with Firebase configuration. The key issue we're addressing is the proper handling of environment variables to avoid the "Secret does not exist" error.

## Environment Variables Configuration

### Why Remove Secret References from vercel.json

The previous [vercel.json](file:///Users/thaladasrinivas/Downloads/telemed-bridge-main/vercel.json) configuration referenced secrets using the [@](file:///Users/thaladasrinivas/Downloads/telemed-bridge-main/src/lib/notification-service.ts#L327-L333) syntax (e.g., "@vite_firebase_api_key"), but these secrets had not been created in the Vercel dashboard. According to Vercel best practices for Vite applications:

> When deploying Vite applications, avoid referencing environment variables as secrets in configuration files like vercel.json unless the secrets are explicitly defined in the platform dashboard.

### Updated vercel.json Configuration

The updated [vercel.json](file:///Users/thaladasrinivas/Downloads/telemed-bridge-main/vercel.json) file no longer contains environment variable definitions:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "framework": "vite",
  "regions": ["iad1"]
}
```

## Setting Up Environment Variables in Vercel Dashboard

### Step-by-Step Instructions

1. **Access Your Vercel Project**
   - Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your Vaidhya Setu project

2. **Navigate to Environment Variables Settings**
   - Click on the "Settings" tab
   - Select "Environment Variables" from the sidebar

3. **Add Required Environment Variables**
   Add the following environment variables with your actual Firebase configuration values:

   | Variable Name | Description | Example Value |
   |---------------|-------------|---------------|
   | `VITE_FIREBASE_API_KEY` | Firebase API Key | `AIzaSyDIQP3Mgu1BpF4pftSelrDvE8nQSbhXwQ8` |
   | `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `hackathon-79e80.firebaseapp.com` |
   | `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | `hackathon-79e80` |
   | `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | `hackathon-79e80.firebasestorage.app` |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | `338581325054` |
   | `VITE_FIREBASE_APP_ID` | Firebase App ID | `1:338581325054:web:10ad1b4e1793d5a7b491af` |
   | `VITE_FIREBASE_MEASUREMENT_ID` | Firebase Measurement ID | `G-WN45LN4MR6` |
   | `VITE_FIREBASE_VAPID_KEY` | Firebase VAPID Key | `Your VAPID key from Firebase Console` |

4. **Obtain Your Firebase Configuration Values**
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Select your project (hackathon-79e80)
   - Click the gear icon next to "Project Overview" and select "Project settings"
   - Under "General" tab, you'll find the Firebase SDK configuration
   - For the VAPID key, go to "Cloud Messaging" tab

5. **Redeploy Your Application**
   - After adding the environment variables, Vercel will automatically redeploy your application
   - If it doesn't, you can trigger a new deployment from the "Deployments" tab

## Security Considerations

### Public Nature of VITE_ Variables

It's important to understand that environment variables with the `VITE_` prefix are:
- Embedded in the client-side JavaScript bundle
- Visible to all users of your application
- Not suitable for storing secrets like private API keys

Firebase configuration values are intentionally designed to be public. Firebase security is handled through:
1. Firestore security rules
2. Firebase Authentication
3. Storage security rules

### What Not to Store in VITE_ Variables

Never store the following in `VITE_` environment variables:
- Private API keys
- Database passwords
- Secret tokens
- Any sensitive server-side configuration

## Troubleshooting

### Common Issues and Solutions

1. **"Secret does not exist" Error**
   - **Cause**: Referencing a secret in vercel.json that hasn't been created
   - **Solution**: Remove secret references from vercel.json and add environment variables through the Vercel dashboard

2. **Firebase Not Initializing**
   - **Cause**: Missing or incorrect environment variable values
   - **Solution**: Double-check all Firebase configuration values in the Vercel dashboard

3. **Environment Variables Not Loading**
   - **Cause**: Using incorrect variable names or missing the `VITE_` prefix
   - **Solution**: Ensure all environment variables use the correct `VITE_` prefix and match the names used in your code

## Local Development

For local development, ensure you have a [.env](file:///Users/thaladasrinivas/Downloads/telemed-bridge-main/.env) file in your project root with all the required variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
VITE_FIREBASE_VAPID_KEY=your_firebase_vapid_key
```

Remember to keep your [.env](file:///Users/thaladasrinivas/Downloads/telemed-bridge-main/.env) file in [.gitignore](file:///Users/thaladasrinivas/Downloads/telemed-bridge-main/.gitignore) to prevent committing sensitive information to version control.

## Verification

After deployment, you can verify that environment variables are properly loaded by:

1. Checking the browser console for any Firebase initialization errors
2. Testing Firebase functionality in your application
3. Verifying that the application can connect to Firestore and Authentication services

If you encounter any issues, check the Vercel deployment logs for more detailed error information.