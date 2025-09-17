#!/bin/bash

echo "📦 Installing Firebase and Dependencies for Vaidhya Setu"
echo "====================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this from the project root."
    exit 1
fi

echo "🔍 Current Firebase version in package.json:"
grep '"firebase"' package.json

echo ""
echo "📦 Installing all dependencies (including Firebase)..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! All dependencies installed successfully!"
    echo ""
    echo "🔥 Firebase SDK installed and ready for:"
    echo "   • Authentication (Firebase Auth)"
    echo "   • Database (Firestore)"
    echo "   • Storage (Firebase Storage)"
    echo "   • Hosting (Firebase Hosting)"
    echo "   • Analytics (Firebase Analytics)"
    echo ""
    echo "📋 Installed Firebase version:"
    npm list firebase
    echo ""
    echo "🎯 Next steps:"
    echo "   1. Firebase is ready to use in your telemedicine platform"
    echo "   2. Build the project: npm run build"
    echo "   3. Deploy to Firebase: firebase deploy --only hosting"
    echo ""
    echo "🏥 Your Vaidhya Setu platform includes:"
    echo "   • WebRTC video calls using Firebase Firestore signaling"
    echo "   • Real-time appointment sync"
    echo "   • Secure patient data storage"
    echo "   • Mobile-responsive design"
else
    echo ""
    echo "❌ Installation failed!"
    echo "🔧 Try these troubleshooting steps:"
    echo "   1. Clear npm cache: npm cache clean --force"
    echo "   2. Delete node_modules: rm -rf node_modules"
    echo "   3. Delete package-lock.json: rm package-lock.json"
    echo "   4. Reinstall: npm install"
    exit 1
fi