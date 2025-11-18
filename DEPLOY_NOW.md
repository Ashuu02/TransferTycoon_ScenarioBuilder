# Quick Deployment Guide

## ✅ Step 1: Create GitHub Repository

1. **Go to GitHub**: https://github.com/new
2. **Repository name**: `transfertycoon-scenario-builder` (or any name you prefer)
3. **Description**: "Form to JSON converter for clinical scenarios - No AI, no APIs, pure static website"
4. **Visibility**: 
   - Choose **Public** (if you want to share it)
   - Or **Private** (if you want to keep it private)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. **Click "Create repository"**

## ✅ Step 2: Connect and Push to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add your GitHub repository as remote (replace YOUR_USERNAME and YOUR_REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename branch to main (if needed)
git branch -M main

# Push your code
git push -u origin main
```

**Example:**
If your username is `ashutoshshimpi` and repo name is `transfertycoon-scenario-builder`:
```bash
git remote add origin https://github.com/ashutoshshimpi/transfertycoon-scenario-builder.git
git branch -M main
git push -u origin main
```

## ✅ Step 3: Deploy to Vercel

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** (use your GitHub account for easiest setup)
3. **Click "Add New..." → "Project"**
4. **Import your repository**:
   - Find `transfertycoon-scenario-builder` (or your repo name)
   - Click "Import"
5. **Configure Project** (Vercel auto-detects these, but verify):
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. **Environment Variables**: None needed! (No API keys required)
7. **Click "Deploy"**
8. **Wait 1-2 minutes** for deployment
9. **Get your live URL**: `https://your-app-name.vercel.app`

## 🎉 Done!

Your app is now:
- ✅ On GitHub
- ✅ Live on Vercel
- ✅ Shareable with anyone via the Vercel URL

## 📝 Future Updates

Whenever you make changes:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Vercel will automatically redeploy! 🚀

