# Deployment Guide

This guide will help you deploy GymFlow to Vercel (Frontend) and Render (Backend).

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Render account (free tier available)
- Git installed locally

## Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - GymFlow MVP"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/santhu587/Gymflow.git

# Push to main branch
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend to Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name:** `gymflow-backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
   - **Start Command:** `gunicorn gym_management.wsgi:application --bind 0.0.0.0:$PORT`

5. **Add Environment Variables:**
   ```
   SECRET_KEY=<generate-a-random-secret-key>
   DEBUG=False
   ALLOWED_HOSTS=your-service-name.onrender.com
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```

6. **Add PostgreSQL Database:**
   - Click "New +" → "PostgreSQL"
   - Name: `gymflow-db`
   - Copy the **Internal Database URL**
   - Add to environment variables:
     ```
     DATABASE_URL=<internal-database-url-from-render>
     ```

7. **Click "Create Web Service"**
8. **Wait for deployment to complete**
9. **Copy your backend URL** (e.g., `https://gymflow-backend.onrender.com`)

## Step 3: Deploy Frontend to Vercel

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "Add New..." → "Project"**
3. **Import your GitHub repository**
4. **Configure the project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

5. **Add Environment Variable:**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```
   (Replace with your actual Render backend URL)

6. **Click "Deploy"**
7. **Wait for deployment to complete**
8. **Copy your frontend URL** (e.g., `https://gymflow.vercel.app`)

## Step 4: Update CORS Settings

1. **Go back to Render Dashboard**
2. **Edit your backend service**
3. **Update Environment Variable:**
   ```
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```
   (Replace with your actual Vercel frontend URL)

4. **Save and redeploy**

## Step 5: Create Superuser (Optional)

1. **In Render Dashboard, go to your backend service**
2. **Click "Shell" tab**
3. **Run:**
   ```bash
   python manage.py createsuperuser
   ```
4. **Follow prompts to create admin user**

## Step 6: Test Deployment

1. Visit your Vercel frontend URL
2. Try registering a new account
3. Try logging in
4. Test all features

## Troubleshooting

### Backend Issues

- **Database connection errors:** Check DATABASE_URL is set correctly
- **CORS errors:** Verify CORS_ALLOWED_ORIGINS includes your frontend URL
- **Static files not loading:** Ensure `collectstatic` runs in build command

### Frontend Issues

- **API connection errors:** Verify VITE_API_URL is set correctly
- **Build errors:** Check Node.js version (should be 18+)
- **404 errors:** Ensure vercel.json rewrite rules are correct

## Environment Variables Summary

### Backend (Render)
```
SECRET_KEY=<random-secret-key>
DEBUG=False
ALLOWED_HOSTS=your-backend.onrender.com
DATABASE_URL=<from-render-postgres>
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com
```

## Support

For issues, check:
- Render logs: Dashboard → Your Service → Logs
- Vercel logs: Dashboard → Your Project → Deployments → View Function Logs

---

**Design & Development by [SansaTechSolution.com](https://sansatechsolution.com)**

