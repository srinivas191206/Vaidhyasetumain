# 🚀 Deployment Guide

## Method 1: GitHub + Vercel (Recommended)

### Step 1: Setup Git Repository
```bash
cd /path/to/your/project
git init
git config user.name "srinivas191206"
git config user.email "your-email@example.com"
git add .
git commit -m "Initial commit: Telemedicine platform with video calls"
```

### Step 2: Create GitHub Repository
1. Go to GitHub.com
2. Click "+" → "New repository"
3. Name: `clinic-pro-telemedicine`
4. Description: "Telemedicine platform connecting rural health centers with specialists"
5. Make it Public (or Private)
6. Don't initialize with README (you already have one)

### Step 3: Push to GitHub
```bash
git remote add origin https://github.com/srinivas191206/clinic-pro-telemedicine.git
git branch -M main
git push -u origin main
```

### Step 4: Deploy with Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Import Project"
4. Select your `clinic-pro-telemedicine` repository
5. Configure:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Step 5: Add Environment Variables in Vercel
In Vercel dashboard → Settings → Environment Variables:
```
VITE_FIREBASE_API_KEY = your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN = your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = your_project_id
VITE_FIREBASE_STORAGE_BUCKET = your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID = your_sender_id
VITE_FIREBASE_APP_ID = your_app_id
VITE_FIREBASE_MEASUREMENT_ID = your_measurement_id
```

### Step 6: Deploy
Click "Deploy" - Your app will be live at `https://your-app-name.vercel.app`

---

## Method 2: Firebase Hosting

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### Step 2: Initialize Firebase Hosting
```bash
cd /path/to/your/project
firebase init hosting
# Select your Firebase project
# Choose 'dist' as public directory
# Configure as single-page app: Yes
# Set up automatic builds: No (we'll build manually)
```

### Step 3: Build and Deploy
```bash
npm run build
firebase deploy
```

Your app will be live at `https://your-project-id.web.app`

---

## 🔧 Environment Variables Guide

### For Vercel:
Add in Vercel Dashboard → Settings → Environment Variables

### For Firebase:
Create `.env` file in project root (copy from `.env.example`)

### For Local Development:
```bash
cp .env.example .env
# Edit .env with your Firebase config
```

---

## 🌐 Custom Domain Setup

### Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Firebase:
1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow DNS setup instructions

---

## 📱 Production Checklist

- [ ] Firebase security rules deployed
- [ ] Environment variables configured
- [ ] HTTPS enabled (automatic with both platforms)
- [ ] Test video calls work in production
- [ ] Test camera/microphone permissions
- [ ] Test notifications sync properly
- [ ] Custom domain configured (optional)

---

## 🔄 Continuous Deployment

Both Vercel and Firebase support automatic deployments:

**Vercel**: Automatically deploys on git push to main branch
**Firebase**: Set up GitHub Actions for auto-deployment

---

## 💰 Cost Comparison

### Vercel (Free Tier):
- 100GB bandwidth/month
- Unlimited static sites
- $0/month

### Firebase (Free Tier):
- 10GB storage
- 1GB bandwidth/day
- $0/month

Both are excellent for your telemedicine platform!