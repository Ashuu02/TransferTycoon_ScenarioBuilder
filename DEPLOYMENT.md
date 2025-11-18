# Deployment Guide

This guide will help you deploy your TransferTycoon Scenario Builder app as a static website, making it accessible to everyone on the web.

## What This App Is

This is a **plain static website** that converts form responses to JSON. It:
- ✅ Works entirely in the browser (no server needed)
- ✅ Has no AI or external APIs
- ✅ Requires no API keys or configuration
- ✅ Builds to simple HTML/CSS/JavaScript files

## Prerequisites

- A GitHub account (to host your code)
- A Vercel account (free tier is sufficient)

**No API keys, no AI, no configuration needed!** Just deploy and share.

## Step 1: Push Your Code to GitHub

1. **Create a new repository on GitHub:**
   - Go to [github.com](https://github.com) and click "New repository"
   - Name it (e.g., `transfertycoon-scenario-builder`)
   - Make it public or private (your choice)
   - **Don't** initialize with README, .gitignore, or license (since you already have these)

2. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Sign up/Login to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up or log in with your GitHub account

2. **Import your project:**
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete (usually 1-2 minutes)

4. **Access your site:**
   - Once deployed, Vercel will provide you with a URL like: `https://your-app-name.vercel.app`
   - You can share this URL with anyone!
   - **No configuration needed** - just deploy and share!

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   - Follow the prompts
   - No environment variables needed!

4. **Deploy to production:**
   ```bash
   vercel --prod
   ```

## Step 3: Custom Domain (Optional)

If you want a custom domain:

1. Go to your project settings on Vercel
2. Click "Domains"
3. Add your domain name
4. Follow the DNS configuration instructions

## Important Notes

### Plain Static Website 🎉
This app builds to plain HTML, CSS, and JavaScript files - no server, no APIs, no AI. All form processing and JSON generation happens entirely in the user's browser. The built site is completely self-contained and can be hosted on any static hosting service.

### Updating Your Deployment
Every time you push to your GitHub repository's main branch, Vercel will automatically redeploy your app with the latest changes.

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Run `npm install` to ensure all dependencies are installed
- Check the build logs in Vercel dashboard

### App Not Loading
- Check the Vercel deployment logs
- Verify the build completed successfully
- Check browser console for errors

## Alternative Deployment Options

If you prefer not to use Vercel, here are other options:

### Netlify
1. Sign up at [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Build command: `npm run build`
4. Publish directory: `dist`
5. No environment variables needed!

### GitHub Pages
1. Install `gh-pages`: `npm install --save-dev gh-pages`
2. Add to `package.json` scripts: `"deploy": "npm run build && gh-pages -d dist"`
3. Run: `npm run deploy`
4. Note: GitHub Pages requires additional configuration for SPA routing

## Support

If you encounter any issues, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- Your project's build logs in the Vercel dashboard

