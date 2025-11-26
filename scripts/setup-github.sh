#!/bin/bash

# Setup script to connect local repository to GitHub and deploy to Vercel

set -e

echo "🚀 GitHub & Vercel Setup Helper"
echo "================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Run 'git init' first."
    exit 1
fi

# Prompt for GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ GitHub username is required"
    exit 1
fi

# Prompt for repository name
read -p "Enter repository name (default: quick-attach): " REPO_NAME
REPO_NAME=${REPO_NAME:-quick-attach}

echo ""
echo "📝 Next steps:"
echo ""
echo "1. Create a new repository on GitHub:"
echo "   → Go to: https://github.com/new"
echo "   → Repository name: $REPO_NAME"
echo "   → Make sure it's PUBLIC (for easy Vercel deployment)"
echo "   → DO NOT initialize with README, .gitignore, or license"
echo "   → Click 'Create repository'"
echo ""
echo "2. Once created, press Enter to continue..."
read

# Add remote
echo "🔗 Connecting to GitHub..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
git branch -M main

echo ""
echo "📤 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Successfully pushed to GitHub!"
echo ""
echo "🌐 Next: Deploy to Vercel"
echo ""
echo "Option 1 - Via Web UI (Recommended):"
echo "   1. Go to: https://vercel.com/new"
echo "   2. Import your repository: $GITHUB_USERNAME/$REPO_NAME"
echo "   3. Vercel will auto-detect Next.js settings"
echo "   4. Click 'Deploy'"
echo ""
echo "Option 2 - Via CLI:"
echo "   npm i -g vercel"
echo "   vercel"
echo ""
echo "🎉 After deployment, you'll get a preview URL!"

