#!/bin/bash

# GitHub Setup Commands
# Run these after creating your GitHub repository

echo "🚀 Setting up GitHub remote and pushing code..."

# Add remote origin (replace with your actual repository URL)
git remote add origin https://github.com/srinivas191206/clinic-pro-telemedicine.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main

echo "✅ Code pushed to GitHub successfully!"
echo "🌐 Repository URL: https://github.com/srinivas191206/clinic-pro-telemedicine"
echo ""
echo "📋 Next steps:"
echo "1. Go to vercel.com"
echo "2. Sign in with GitHub"
echo "3. Import your repository"
echo "4. Configure deployment settings"
echo "5. Add environment variables"