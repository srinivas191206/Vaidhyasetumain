#!/bin/bash

# 🚀 Push Clinic Pro Telemedicine Platform to GitHub
# Run this AFTER creating the GitHub repository

echo "🚀 Pushing Clinic Pro Telemedicine Platform to GitHub..."
echo "📋 Repository: https://github.com/srinivas191206/clinic-pro-telemedicine"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Git not initialized"
    exit 1
fi

# Check current status
echo "📊 Current Git status:"
git status

echo ""
echo "🔍 Checking remotes..."
git remote -v

echo ""
echo "🚀 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "🌐 Repository URL: https://github.com/srinivas191206/clinic-pro-telemedicine"
    echo ""
    echo "🎯 Your Telemedicine Platform Features:"
    echo "   🎥 Enhanced video calling with WebRTC"
    echo "   🔔 Real-time notifications with Firestore"
    echo "   🚀 Auto video popup on appointment acceptance"
    echo "   📱 Responsive design with dark mode"
    echo "   🔒 Firebase backend integration"
    echo ""
    echo "📋 Next Steps for Deployment:"
    echo "1. Go to vercel.com"
    echo "2. Sign in with GitHub"
    echo "3. Import your clinic-pro-telemedicine repository"
    echo "4. Configure environment variables"
    echo "5. Deploy your telemedicine platform!"
    echo ""
    echo "⚙️  Environment Variables Needed for Vercel:"
    echo "   VITE_FIREBASE_API_KEY"
    echo "   VITE_FIREBASE_AUTH_DOMAIN"
    echo "   VITE_FIREBASE_PROJECT_ID"
    echo "   VITE_FIREBASE_STORAGE_BUCKET"
    echo "   VITE_FIREBASE_MESSAGING_SENDER_ID"
    echo "   VITE_FIREBASE_APP_ID"
    echo "   VITE_FIREBASE_MEASUREMENT_ID"
else
    echo ""
    echo "❌ Push failed. Please check:"
    echo "1. Repository exists on GitHub"
    echo "2. You have write access to the repository"
    echo "3. Internet connection is working"
    echo ""
    echo "💡 Create the repository first at:"
    echo "   https://github.com/new"
    echo "   Repository name: clinic-pro-telemedicine"
fi