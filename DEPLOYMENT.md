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
git remote add origin https://github.com/santhu587/Gymflow23.git

# Push to main branch
git branch -M main
git push -u origin main
```

## Step 2: Create MySQL Database First (IMPORTANT!)

**⚠️ You MUST create the database BEFORE creating the web service!**

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
2. **Click "New +" button** at the top right
3. **Select "MySQL"** from the dropdown (NOT "Web Service")
   - If you don't see "MySQL", make sure you're clicking "New +" at the dashboard level
   - Note: Render may not have MySQL, in which case use PostgreSQL and update DATABASE_URL format
4. **Configure the database:**
   - **Name:** `gymflow-db`
   - **Database:** `gym_management`
   - **User:** `gymflow_user` (or leave default)
   - **Region:** Choose closest to you
   - **Plan:** Free (for testing) or Starter ($7/month for production)
5. **Click "Create Database"**
6. **Wait for provisioning** (1-2 minutes)
7. **Once ready**, go to the database dashboard
8. **Copy the "Internal Database URL"** (looks like: `mysql://user:pass@host:3306/dbname`)
   - Keep this URL safe - you'll need it in the next step!
   - **Note:** If using PostgreSQL, URL format is `postgresql://user:pass@host:5432/dbname`

## Step 3: Deploy Backend to Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository:**
   - Select: `santhu587/Gymflow23`
   - Branch: `main`
4. **Configure the service:**
   - **Name:** `gymflow-backend`
   - **Root Directory:** `backend` (IMPORTANT!)
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
   - **Start Command:** `gunicorn gym_management.wsgi:application --bind 0.0.0.0:$PORT`

5. **Add Environment Variables:**
   - Scroll down to "Environment Variables" section
   - Click **"+ Add Environment Variable"** button
   - Add each variable one by one:
   
   **Variable 1: SECRET_KEY**
   - Key: `SECRET_KEY`
   - Value: Click "Generate" button (or create a random string)
   
   **Variable 2: DEBUG**
   - Key: `DEBUG`
   - Value: `False`
   
   **Variable 3: ALLOWED_HOSTS**
   - Key: `ALLOWED_HOSTS`
   - Value: `gymflow-backend.onrender.com` (or your actual service URL)
   
   **Variable 4: DATABASE_URL** ⭐ (IMPORTANT!)
   - Key: `DATABASE_URL`
   - Value: Paste the **Internal Database URL** you copied from Step 2
   - For MySQL: `mysql://user:password@hostname:3306/dbname`
   - For PostgreSQL: `postgresql://user:password@hostname:5432/dbname`
   - Render will auto-detect the database type from the URL
   
   **Variable 5: CORS_ALLOWED_ORIGINS**
   - Key: `CORS_ALLOWED_ORIGINS`
   - Value: `https://your-frontend.vercel.app` (update after deploying frontend)
   
   - Click **"Save Changes"** after adding all variables

6. **Click "Create Web Service"**
7. **Wait for deployment to complete** (3-5 minutes)
8. **Copy your backend URL** (e.g., `https://gymflow-backend.onrender.com`)

## Step 4: Deploy Frontend to Vercel

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

## Step 5: Update CORS Settings

1. **Go back to Render Dashboard**
2. **Edit your backend service**
3. **Update Environment Variable:**
   ```
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```
   (Replace with your actual Vercel frontend URL)

4. **Save and redeploy**

## Step 6: Create Superuser (Optional)

1. **In Render Dashboard, go to your backend service**
2. **Click "Shell" tab**
3. **Run:**
   ```bash
   python manage.py createsuperuser
   ```
4. **Follow prompts to create admin user**

## Step 7: Test Deployment

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

