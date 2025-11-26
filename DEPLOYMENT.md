# Deployment Instructions

## Quick Deploy to Vercel via GitHub

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `quick-attach` (or your preferred name)
3. **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click "Create repository"

### Step 2: Connect Local Repository to GitHub

Run these commands (replace `YOUR_USERNAME` with your GitHub username):

```bash
git remote add origin https://github.com/YOUR_USERNAME/quick-attach.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your GitHub repository (`quick-attach`)
4. Vercel will auto-detect Next.js settings
5. Click "Deploy"

Vercel will:
- Build your project
- Create a preview URL
- Set up automatic deployments on every push to main

### Alternative: Deploy via Vercel CLI

If you have Vercel CLI installed:

```bash
npm i -g vercel
vercel
```

Follow the prompts to connect your project.

---

## Your Deployment URL

After deployment, you'll get a URL like:
- `https://quick-attach-xxxxx.vercel.app` (production)
- `https://quick-attach-git-main-xxxxx.vercel.app` (preview)

You can also set up a custom domain in Vercel project settings.

