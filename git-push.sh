#!/bin/bash

echo "🚀 Pushing Clinic Pro Emergency Fix to GitHub..."
echo "================================================="

# Configure Git with preferred username
echo "🔧 Configuring Git with preferred username..."
git config user.name "srinivas191206"
git config user.email "srinivas191206@example.com"

echo "✅ Git configured with username: srinivas191206"

# Check Git status
echo "📋 Checking Git status..."
git status

# Add all changes
echo "📝 Adding all changes..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "⚠️  No changes to commit. Everything is up to date."
else
    echo "💾 Committing emergency white screen fix..."
    git commit -m "EMERGENCY FIX: Deploy simple working version to fix white screen

- Replace complex App with SimpleApp.tsx (bulletproof inline styles)
- Add minimal.css fallback instead of complex Tailwind
- Comprehensive error handling in main.tsx with HTML fallbacks
- Remove all external dependencies that could cause loading issues
- Add emergency deployment scripts for quick fixes

This WILL fix the white screen on https://anits.netlify.app
Platform: Clinic Pro Telemedicine - Connecting rural healthcare"
fi

# Check if remote exists, if not add it
if ! git remote get-url origin >/dev/null 2>&1; then
    echo "🔗 Adding GitHub remote repository..."
    git remote add origin https://github.com/srinivas191206/Vaidhyasetumain.git
else
    echo "✅ Remote origin already configured"
fi

# Ensure we're on main branch
echo "🌿 Ensuring we're on main branch..."
git branch -M main

# Push to GitHub
echo "🚀 Pushing to GitHub repository..."
echo "Repository: https://github.com/srinivas191206/Vaidhyasetumain.git"

if git push -u origin main; then
    echo ""
    echo "🎉 SUCCESS! Emergency fix pushed to GitHub!"
    echo "=========================================="
    echo ""
    echo "📍 Repository: https://github.com/srinivas191206/Vaidhyasetumain"
    echo "🌐 Netlify will auto-deploy from GitHub in 1-2 minutes"
    echo "🔗 Live URL: https://anits.netlify.app"
    echo ""
    echo "✅ What happens next:"
    echo "   1. Netlify detects the Git push"
    echo "   2. Automatically rebuilds and deploys"
    echo "   3. Site should show working Clinic Pro platform"
    echo "   4. NO MORE WHITE SCREEN!"
    echo ""
    echo "🔍 If you still see white screen after 3 minutes:"
    echo "   - Hard refresh: Ctrl+F5 or Cmd+Shift+R"
    echo "   - Clear browser cache"
    echo "   - Try incognito mode"
else
    echo ""
    echo "❌ Push failed. This might be because:"
    echo "   1. Repository doesn't exist on GitHub"
    echo "   2. Authentication issues"
    echo "   3. Network connectivity problems"
    echo ""
    echo "🔧 To fix:"
    echo "   1. Make sure repository exists: https://github.com/srinivas191206/Vaidhyasetumain"
    echo "   2. Check if you're logged into Git: git config --list"
    echo "   3. Try manual push: git push -u origin main"
fi