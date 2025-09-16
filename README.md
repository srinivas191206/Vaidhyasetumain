# 🏥 Vaidhya Setu - Telemedicine Platform

A comprehensive telemedicine platform connecting rural health centers with specialist doctors through secure video consultations and real-time notifications.

## 🚀 Features

- **Real-time Notifications** - Instant appointment requests and responses
- **Video Consultations** - WebRTC-powered video calls with camera/microphone fallbacks
- **Multi-portal Access** - Separate interfaces for doctors and health centers
- **Firebase Integration** - Secure data storage and real-time synchronization
- **Auto Video Popup** - Seamless transition from appointment acceptance to video call

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui components
- **Backend**: Firebase (Firestore, Authentication)
- **Video**: WebRTC with Firebase signaling
- **Notifications**: Real-time Firestore listeners

## 📋 Prerequisites

- Node.js 18+ or Bun
- Firebase project with Firestore enabled
- HTTPS or localhost for camera/microphone access

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/srinivas191206/vaidhya-setu.git
   cd vaidhya-setu
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Configure Firebase**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your Firebase configuration.

4. **Start development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

## 🌐 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy automatically

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

## 📱 Usage

### For Health Centers
1. Select "Rural Health Center" portal
2. Login with credentials
3. Create patient profiles
4. Send appointment requests to specialists
5. Receive real-time responses

### For Doctors
1. Select "Specialist" portal
2. Login with credentials
3. Receive appointment notifications
4. Accept requests with auto video call popup
5. Conduct video consultations

## 🧪 Testing

Test camera and microphone access:
```bash
# Open in browser
open test-permissions.html
```

## 🔒 Security

- HTTPS required for camera/microphone access
- Firebase security rules for data protection
- Role-based access control
- Secure video call validation

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues with camera/microphone access, see the troubleshooting guide in `test-permissions.html`.

---

**Built with ❤️ for connecting rural healthcare with specialist expertise.**