#!/bin/bash

echo "🚀 Complete Firebase Deployment Pipeline"
echo "========================================"
echo ""
echo "This will:"
echo "1. Commit emergency fixes to GitHub"
echo "2. Deploy to Firebase Hosting"
echo "3. Provide live URLs for your telemedicine platform"
echo ""

# Configure Git with preferred username
echo "🔧 Configuring Git with preferred username srinivas191206..."
git config user.name "srinivas191206"
git config user.email "srinivas191206@example.com"

# Stage all changes
echo "📝 Staging all changes..."
git add .

# Check if there are changes to commit
if ! git diff --staged --quiet; then
    echo "💾 Committing changes to GitHub..."
    git commit -m "Deploy to Firebase Hosting: Vaidhya Setu Telemedicine Platform

✨ Features included:
- Emergency white screen fix with SimpleApp fallback
- Complete telemedicine platform with video calls
- Real-time appointment management
- Doctor-patient portal system
- Firebase Firestore integration
- WebRTC video consultation
- Mobile-responsive design

🏥 Platform: Vaidhya Setu - Bridging rural healthcare gaps
🌐 Deployment: Firebase Hosting (hackathon-79e80)
👤 Developer: srinivas191206"

    echo "🚀 Pushing to GitHub..."
    git push

    if [ $? -eq 0 ]; then
        echo "✅ Successfully pushed to GitHub!"
    else
        echo "⚠️  GitHub push failed, but continuing with Firebase deployment..."
    fi
else
    echo "ℹ️  No changes to commit"
fi

echo ""
echo "🔥 Starting Firebase deployment..."
echo ""

# Run Firebase deployment
./deploy-firebase.sh