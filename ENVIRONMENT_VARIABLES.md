# Environment Variables Configuration

This document explains how to configure and use environment variables in the Clinic Pro Telemedicine Platform.

## Overview

Environment variables are used to configure the application without hardcoding sensitive or environment-specific values in the source code. This project uses Vite's environment variable system, which requires variables to be prefixed with `VITE_` to be exposed to the client-side code.

## Configuration Files

### .env
- Contains the actual configuration values
- **This file should never be committed to version control**
- It's already added to `.gitignore`

### .env.example
- Documents all available environment variables
- Shows the expected format and possible values
- Safe to commit to version control
- Copy this file to `.env` and fill in your values

## Required Environment Variables

### Firebase Configuration
```bash
# Firebase Core Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
```

### Application Configuration
```bash
# Application Configuration
VITE_APP_NAME=Clinic Pro Telemedicine
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development
```

### Feature Flags
```bash
# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_VIDEO_CALLS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_CHAT=true
```

## Usage in Code

Environment variables can be accessed in the code using `import.meta.env`:

```typescript
// Access environment variables
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const appName = import.meta.env.VITE_APP_NAME;

// Provide fallback values for optional variables
const debugMode = import.meta.env.VITE_DEBUG_LOGS === 'true' || false;
```

## Security Considerations

1. **Never commit `.env` files** - They contain sensitive information
2. **Only use `VITE_` prefix for public values** - Anything with `VITE_` is exposed to the client
3. **Server-side secrets should not be in `.env`** - Use server-side environment variables instead
4. **Validate required variables** - Check that critical variables are present

## Development vs Production

You can have different environment files for different environments:
- `.env.development` - Development environment
- `.env.production` - Production environment
- `.env.local` - Local overrides (not committed)

## Testing Environment Variables

The application includes a test utility that verifies environment variables are loaded correctly. This runs automatically in development mode and outputs to the browser console.

## Troubleshooting

If environment variables are not loading:
1. Ensure they are prefixed with `VITE_`
2. Restart the development server
3. Check that the `.env` file is in the project root
4. Verify there are no syntax errors in the `.env` file