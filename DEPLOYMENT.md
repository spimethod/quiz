# Deployment Guide - Vercel

## 📋 Prerequisites

1. GitHub account
2. Vercel account (free) - https://vercel.com

## 🚀 Deployment Steps

### Step 1: Push to GitHub

1. Create a new repository on GitHub (e.g., `quiz-avocado`)
2. Push your code:

```bash
git remote add origin https://github.com/YOUR_USERNAME/quiz-avocado.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "Add New Project"
4. Import your `quiz-avocado` repository
5. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
6. Click "Deploy"
7. Wait for deployment to complete (usually 1-2 minutes)
8. Your app will be live at `https://your-project.vercel.app`

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## 🔧 Environment Variables (if needed)

If you need to add environment variables later:

1. Go to your project on Vercel Dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add variables for Development, Preview, and Production
4. Redeploy the project

## 🔄 Automatic Deployments

Once connected to GitHub:

- **Production**: Automatically deploys when you push to `main` branch
- **Preview**: Automatically creates preview deployments for pull requests

## 📱 Custom Domain (Optional)

1. Go to your project on Vercel
2. Navigate to "Settings" → "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## ✅ Post-Deployment Checklist

- [ ] Test all pages on the live URL
- [ ] Verify mobile responsiveness
- [ ] Check that all images load correctly
- [ ] Test all modal windows
- [ ] Verify navigation between pages
- [ ] Check browser console for errors

## 🐛 Troubleshooting

### Build Fails

- Check the build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Test `npm run build` locally

### Images Not Loading

- Ensure all images are in the `public` folder
- Check file names match the imports (case-sensitive)

### 404 Errors

- Verify page structure in `app` directory
- Check that all routes are properly configured

## 📞 Support

For issues with Vercel: https://vercel.com/support
For Next.js issues: https://nextjs.org/docs
