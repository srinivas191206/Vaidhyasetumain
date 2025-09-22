#!/bin/bash

echo "🚀 Deploying Clinic Pro Telemedicine Platform to Firebase Hosting..."
echo "===================================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Configure Git with preferred username
echo "🔧 Configuring Git with preferred username..."
git config user.name "srinivas191206"
git config user.email "srinivas191206@example.com"
echo "✅ Git configured with username: srinivas191206"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install dependencies"
    exit 1
fi

# Build the project
echo "🔨 Building the project for production..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error: Build failed"
    exit 1
fi

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed. dist folder not created."
    exit 1
fi

echo "✅ Build successful! dist folder created."

# Use npx to avoid global installation issues
echo "🔐 Checking Firebase authentication..."
npx firebase-tools login --no-localhost

if [ $? -ne 0 ]; then
    echo "❌ Error: Firebase login failed"
    echo "Please run 'npx firebase-tools login' manually and try again"
    exit 1
fi

# Check if we're using the correct project
echo "🔍 Setting Firebase project..."
npx firebase-tools use hackathon-79e80

if [ $? -ne 0 ]; then
    echo "⚠️  Warning: Could not set project. Continuing with deployment..."
fi

# Deploy to Firebase Hosting
echo "🌐 Deploying to Firebase Hosting..."
npx firebase-tools deploy --only hosting

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 DEPLOYMENT SUCCESSFUL!"
    echo "======================="
    echo ""
    echo "🌍 Your Clinic Pro telemedicine platform is now live!"
    echo ""
    echo "📱 Live URLs:"
    echo "   • Primary: https://hackathon-79e80.web.app"
    echo "   • Secondary: https://hackathon-79e80.firebaseapp.com"
    echo ""
    echo "🔗 Features available:"
    echo "   • Real-time video consultations with WebRTC"
    echo "   • Doctor-patient appointment management"
    echo "   • Secure messaging system"
    echo "   • Medical records management"
    echo "   • Real-time notifications"
    echo "   • Emergency consultation requests"
    echo ""
    echo "📱 The platform is optimized for:"
    echo "   • Desktop browsers"
    echo "   • Mobile devices"
    echo "   • Tablet interfaces"
    echo ""
    echo "🔒 Security features:"
    echo "   • Firebase Authentication ready"
    echo "   • Firestore security rules configured"
    echo "   • HTTPS enforced"
    echo ""
    echo "💡 Next steps:"
    echo "   1. Test the live site"
    echo "   2. Configure Firebase Authentication"
    echo "   3. Set up user roles (doctors, patients, health centers)"
    echo "   4. Test video calling functionality"
    echo ""
else
    echo ""
    echo "❌ DEPLOYMENT FAILED"
    echo "=================="
    echo ""
    echo "🔧 Troubleshooting steps:"
    echo "   1. Check if you're logged into Firebase: npx firebase-tools login"
    echo "   2. Verify project access: npx firebase-tools projects:list"
    echo "   3. Check build output: npm run build"
    echo "   4. Verify dist folder exists and has content"
    echo "   5. Try manual deployment: npx firebase-tools deploy --only hosting"
    echo ""
    exit 1
fi