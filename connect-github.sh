#!/bin/bash

# 🚀 Connect to GitHub Repository
# Run this script AFTER creating your GitHub repository

echo "🔗 Connecting to GitHub repository..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Git not initialized. Run 'git init' first"
    exit 1
fi

# Add GitHub remote
echo "📡 Adding GitHub remote..."
git remote add origin https://github.com/srinivas191206/clinic-pro-telemedicine.git

# Verify remote was added
echo "🔍 Verifying remote..."
git remote -v

# Set main branch
echo "🌿 Setting main branch..."
git branch -M main

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Successfully connected to GitHub!"
echo "🌐 Repository URL: https://github.com/srinivas191206/clinic-pro-telemedicine"
echo ""
echo "🎯 Next Steps:"
echo "1. Visit your repository on GitHub to verify files uploaded"
echo "2. Go to vercel.com to deploy your telemedicine platform"
echo "3. Connect your GitHub repository to Vercel"
echo "4. Add your Firebase environment variables in Vercel"
echo "5. Deploy and enjoy your live telemedicine platform!"
echo ""
echo "📋 Your platform includes:"
echo "   🎥 Enhanced video calling with fallbacks"
echo "   🔔 Real-time notifications and sync"
echo "   🚀 Auto video popup on appointment acceptance"
echo "   🔒 Firebase Firestore backend"
echo "   📱 Responsive design with dark mode"