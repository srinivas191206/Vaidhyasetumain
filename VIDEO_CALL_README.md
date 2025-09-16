# WebRTC Video Consultation Feature

This document provides comprehensive instructions for implementing and testing the real-time video consultation feature in your telemedicine platform.

## 🎯 Features Implemented

- ✅ **Real-time WebRTC video calling** between doctors and patients
- ✅ **Firebase Firestore signaling** for offer/answer/ICE candidate exchange
- ✅ **Role-based access control** (only authorized doctors and patients can join calls)
- ✅ **Unique call/room ID per appointment**
- ✅ **Video/Audio toggle controls**
- ✅ **Connection state management**
- ✅ **React component integration**
- ✅ **Standalone HTML test interface**
- ✅ **Firestore security rules**

## 📁 Files Added/Modified

### Core Implementation
- `src/lib/webrtc-video-call.ts` - Main WebRTC service class
- `src/components/VideoCallInterface.tsx` - React video call component
- `src/components/VideoCallTestPage.tsx` - Test interface component
- `src/lib/test-appointment-service.ts` - Helper for creating test data

### Testing & Configuration
- `test-video-call.html` - Standalone test page with Firebase integration
- `firestore.rules` - Security rules for video calls and related collections
- `src/App.tsx` - Updated to include video test route

## 🚀 Quick Start

### 1. Test with Standalone HTML Page

The fastest way to test the video call feature:

```bash
# Open the test page in your browser
open test-video-call.html
# Or serve it via your web server
```

**Steps:**
1. Open `test-video-call.html` in two different browser tabs/windows
2. Configure one as "Doctor" and another as "Patient"
3. Click "Generate Test Data" to create unique IDs
4. Click "Initialize Call" in both tabs
5. Doctor clicks "Start Call", Patient clicks "Join Call"
6. Test video/audio controls

### 2. Test within React Application

```bash
# Access the video test page
http://localhost:8080/?video-test

# Or integrate into existing appointments
# See integration examples below
```

### 3. Deploy Firestore Security Rules

Copy the rules from `firestore.rules` to your Firebase Console:

1. Go to Firebase Console → Firestore Database → Rules
2. Replace existing rules with the content from `firestore.rules`
3. Publish the rules

## 🔧 Integration Guide

### Adding Video Call to Appointment Page

```tsx
import { VideoCallInterface } from '@/components/VideoCallInterface';
import { generateCallId } from '@/lib/webrtc-video-call';

// In your appointment component
const [showVideoCall, setShowVideoCall] = useState(false);

// Start video consultation button
<Button onClick={() => setShowVideoCall(true)}>
  Start Video Consultation
</Button>

// Video call interface
{showVideoCall && (
  <VideoCallInterface
    appointmentId={appointment.id}
    userId={currentUser.uid}
    userRole={currentUser.role} // 'doctor' | 'patient'
    patientName={appointment.patientName}
    doctorName={appointment.doctorName}
    onCallEnd={() => setShowVideoCall(false)}
  />
)}
```

### Using the WebRTC Service Directly

```tsx
import { WebRTCVideoCall, generateCallId } from '@/lib/webrtc-video-call';

const callId = generateCallId(appointmentId);
const videoCall = new WebRTCVideoCall(callId, userId, userRole, appointmentId);

// Initialize and start call
await videoCall.initialize();
await videoCall.startCall(); // Doctor
// or
await videoCall.joinCall(); // Patient

// Set up callbacks
videoCall.onLocalStreamReady = (stream) => {
  localVideoElement.srcObject = stream;
};

videoCall.onRemoteStreamReady = (stream) => {
  remoteVideoElement.srcObject = stream;
};
```

## 🔒 Security Configuration

### Firestore Rules Highlights

The security rules ensure:
- Only appointed doctors and patients can access call documents
- ICE candidates are protected with user-specific access
- Appointment validation for call authorization
- Role-based read/write permissions

### WebRTC Security Features

- **Appointment validation**: Users must be authorized for the specific appointment
- **Role verification**: Doctor/patient roles are validated against appointment data
- **STUN servers**: Uses Google's public STUN servers (consider TURN servers for production)

## 📊 Firestore Collections Structure

```
videoCalls/{callId}
├── appointmentId: string
├── doctorId: string
├── patientId: string
├── status: 'calling' | 'connected' | 'ended'
├── offer: RTCSessionDescription
├── answer: RTCSessionDescription
├── createdAt: timestamp
└── iceCandidates/{userId}
    ├── candidates: RTCIceCandidate[]
    └── updatedAt: timestamp

appointments/{appointmentId}
├── doctorId: string
├── patientId: string
├── doctorName: string
├── patientName: string
├── videoRoomId: string
└── status: string
```

## 🧪 Testing Scenarios

### Single Device Testing
1. Open two browser tabs with the test page
2. Configure different roles in each tab
3. Use same appointment ID for both
4. Test call flow

### Multi-Device Testing
1. Open test page on different devices/browsers
2. Share the same appointment ID
3. Test real peer-to-peer connection
4. Verify video/audio quality

### Integration Testing
1. Create actual appointment data
2. Test with real user authentication
3. Verify role-based access control
4. Test error handling scenarios

## 🛠️ Troubleshooting

### Common Issues

**Camera/Microphone Permission Denied**
```
Solution: Ensure HTTPS or localhost for getUserMedia access
Check browser permissions in site settings
```

**Connection Failed**
```
Solution: Check Firestore rules are deployed
Verify Firebase configuration is correct
Ensure both participants are using same appointment ID
```

**No Remote Video**
```
Solution: Check if both users completed call setup
Verify network connectivity (may need TURN servers)
Check browser console for WebRTC errors
```

### Debug Mode

Enable detailed logging by adding to browser console:
```javascript
// Enable WebRTC debug logging
window.localStorage.setItem('debug', 'webrtc*');
```

## 🚀 Production Considerations

### Performance Optimization
- Implement TURN servers for NAT traversal
- Add bandwidth adaptation
- Implement call quality monitoring

### Scalability
- Consider using a dedicated signaling server
- Implement call queuing for high volume
- Add recording capabilities if needed

### Security Enhancements
- Implement call time limits
- Add call recording consent
- Enhance encryption validation

## 📱 Browser Compatibility

| Browser | Video Call | Screen Share | Mobile |
|---------|------------|--------------|--------|
| Chrome  | ✅         | ✅           | ✅     |
| Firefox | ✅         | ✅           | ✅     |
| Safari  | ✅         | ⚠️           | ✅     |
| Edge    | ✅         | ✅           | ✅     |

## 🎮 Demo Usage

### Quick Demo Setup

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Access test page:**
   ```
   http://localhost:8080/?video-test
   ```

3. **Or use standalone HTML:**
   ```bash
   # Serve the HTML file
   python -m http.server 8000
   # Then open http://localhost:8000/test-video-call.html
   ```

### Sample Test Flow

1. **Doctor Setup:**
   - Role: Doctor
   - Generate test data
   - Initialize call
   - Start call
   - Wait for patient

2. **Patient Setup:**
   - Role: Patient
   - Use same appointment ID
   - Initialize call
   - Join call
   - Begin consultation

## 📞 Support

For integration support or issues:
1. Check browser console for errors
2. Verify Firestore rules are deployed
3. Ensure Firebase configuration is correct
4. Test with the standalone HTML page first
5. Check network connectivity for WebRTC

The video consultation feature is now ready for integration into your telemedicine platform!