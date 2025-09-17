#!/bin/bash
# Quick Firebase Deployment Script
# Run this on your local machine where Node.js is installed

echo "🏥 Vaidhya Setu - Quick Firebase Deployment"
echo "==========================================="

# Build and deploy in one go
npm install && \
npm run build && \
echo "🔐 Please login to Firebase when prompted..." && \
firebase login && \
firebase use hackathon-79e80 && \
firebase deploy --only hosting && \
echo "" && \
echo "🎉 SUCCESS! Your telemedicine platform is live!" && \
echo "🌐 Primary URL: https://hackathon-79e80.web.app" && \
echo "🌐 Secondary URL: https://hackathon-79e80.firebaseapp.com" && \
echo "" && \
echo "🏥 Vaidhya Setu Features Now Live:" && \
echo "  ✅ Video consultations" && \
echo "  ✅ Appointment management" && \
echo "  ✅ Real-time notifications" && \
echo "  ✅ Secure messaging" && \
echo "  ✅ Mobile-responsive design"