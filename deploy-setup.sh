#!/bin/bash

echo "🚀 Setting up GymFlow for deployment..."

# Initialize git if not already done
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
fi

# Add all files
echo "📝 Adding files to git..."
git add .

# Commit
echo "💾 Committing changes..."
git commit -m "Initial commit - GymFlow MVP with deployment config"

# Add remote (if not exists)
if ! git remote | grep -q origin; then
    echo "🔗 Adding remote repository..."
    git remote add origin https://github.com/santhu587/Gymflow.git
fi

# Set main branch
echo "🌿 Setting main branch..."
git branch -M main

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Git setup complete!"
echo ""
echo "Next steps:"
echo "1. Go to https://vercel.com and deploy frontend"
echo "2. Go to https://render.com and deploy backend"
echo "3. Follow DEPLOYMENT.md for detailed instructions"
echo ""
echo "🎉 Ready to deploy!"
