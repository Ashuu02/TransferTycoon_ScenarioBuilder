# GitHub & Deployment Setup Guide

## Step 1: Connect to Your Existing GitHub Repository

### Option A: If you want to replace the Google AI Studio version with this one

```bash
# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Update app: Remove AI dependencies, add validation, add back button"

# Add your existing GitHub repository as remote
# Replace YOUR_USERNAME and YOUR_REPO_NAME with your actual GitHub details
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Pull any existing changes (if needed)
git pull origin main --allow-unrelated-histories

# Push your updated code
git push -u origin main --force
```

⚠️ **Note**: Using `--force` will overwrite the Google AI Studio version. If you want to keep both versions, see Option B below.

### Option B: If you want to keep both versions and merge them

```bash
# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Cursor version: No AI, with validation and back button"

# Add your existing GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Fetch existing content
git fetch origin

# Merge with existing main branch (resolve conflicts if any)
git merge origin/main --allow-unrelated-histories

# Push merged version
git push -u origin main
```

---

## Step 2: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign up/login
2. **Click "Add New..." → "Project"**
3. **Select your GitHub repository**
4. **Vercel will auto-detect settings:**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Click "Deploy"** (no environment variables needed!)
6. **Wait 1-2 minutes** for deployment
7. **Get your live URL** (e.g., `https://your-app-name.vercel.app`)

---

## Step 3: Set Up Workflow for Both Google AI Studio & Cursor

### Workflow Overview:
- **Google AI Studio** → pushes to GitHub → auto-deploys to Vercel
- **Cursor** → pushes to GitHub → auto-deploys to Vercel
- Both work with the same repository

### To Update from Google AI Studio:
1. Make changes in Google AI Studio
2. Google AI Studio will automatically commit and push to GitHub
3. Vercel will automatically redeploy

### To Update from Cursor (this setup):

```bash
# Make your changes in Cursor
# Then:

git add .
git commit -m "Description of your changes"
git push origin main

# Vercel will automatically redeploy!
```

### Sync Changes from Google AI Studio to Cursor:

```bash
# Pull latest changes from GitHub
git pull origin main
```

### Sync Changes from Cursor to Google AI Studio:

```bash
# Push your changes
git push origin main

# Then in Google AI Studio, pull the changes
# (Google AI Studio should sync automatically or you can reload)
```

---

## Important Notes:

1. **Always pull before pushing** to avoid conflicts:
   ```bash
   git pull origin main
   git add .
   git commit -m "Your message"
   git push origin main
   ```

2. **If you get merge conflicts:**
   - Cursor will help you resolve them
   - Or use GitHub's web interface to resolve

3. **Vercel auto-deployment:**
   - Every push to `main` branch automatically deploys
   - You can check deployment status in Vercel dashboard

---

## Quick Reference:

| Action | Command |
|--------|---------|
| Pull latest from GitHub | `git pull origin main` |
| Check status | `git status` |
| Add all changes | `git add .` |
| Commit changes | `git commit -m "message"` |
| Push to GitHub | `git push origin main` |
| View remotes | `git remote -v` |

