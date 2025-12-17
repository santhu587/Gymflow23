# 🚂 Railway Deployment Guide - Gymflow23

Complete guide to deploy Gymflow23 backend to Railway and frontend to Vercel.

## Prerequisites

- GitHub account
- Railway account (free tier available)
- Vercel account (free tier available)
- Git installed locally

---

## Step 1: Push Code to GitHub ✅

Your code is already at: `https://github.com/santhu587/Gymflow23.git`

---

## Step 2: Deploy Backend to Railway

### 2.1 Create Railway Account

1. Go to: https://railway.app/
2. Sign up with GitHub
3. Authorize Railway to access your repositories

### 2.2 Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose repository: `santhu587/Gymflow23`
4. Click **"Deploy Now"**

### 2.3 Configure Backend Service

1. Railway will detect your project
2. Click on the service
3. Go to **"Settings"** tab
4. Configure:

   **Root Directory:**
   - Set to: `backend`

   **Start Command:**
   ```
   gunicorn gym_management.wsgi:application --bind 0.0.0.0:$PORT
   ```

   **Build Command:**
   ```
   pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
   ```

### 2.4 Add PostgreSQL Database

1. In your Railway project, click **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway will automatically:
   - Create a PostgreSQL database
   - Add `DATABASE_URL` environment variable
   - Connect it to your service

### 2.5 Add Environment Variables

Go to your service → **"Variables"** tab and add:

**Required Variables:**
```
SECRET_KEY=your-secret-key-here (generate random string)
DEBUG=False
ALLOWED_HOSTS=*.railway.app,your-service-name.railway.app
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

**Note:** `DATABASE_URL` is automatically added by Railway when you add PostgreSQL.

### 2.6 Deploy

1. Railway will automatically deploy
2. Wait for deployment (2-5 minutes)
3. Copy your backend URL (e.g., `https://gymflow-backend.railway.app`)

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Go to Vercel

1. Go to: https://vercel.com/dashboard
2. Sign up/Login with GitHub

### 3.2 Import Project

1. Click **"Add New..."** → **"Project"**
2. Import repository: `santhu587/Gymflow23`
3. Configure:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)

### 3.3 Add Environment Variable

Add this environment variable:

```
VITE_API_URL=https://your-backend.railway.app
```

(Replace with your actual Railway backend URL)

### 3.4 Deploy

1. Click **"Deploy"**
2. Wait for deployment (2-3 minutes)
3. Copy your frontend URL (e.g., `https://gymflow23.vercel.app`)

---

## Step 4: Update CORS Settings

1. Go back to Railway → Your backend service
2. Go to **"Variables"** tab
3. Update `CORS_ALLOWED_ORIGINS`:
   ```
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```
   (Replace with your actual Vercel frontend URL)
4. Service will auto-redeploy

---

## Step 5: Create Superuser

1. In Railway, go to your backend service
2. Click **"Deployments"** tab
3. Click on the latest deployment
4. Click **"View Logs"** → **"Shell"**
5. Run:
   ```bash
   python manage.py createsuperuser
   ```
6. Follow prompts to create admin user

---

## Step 6: Test Deployment

1. Visit your Vercel frontend URL
2. Test registration
3. Test login
4. Test features (add member, trainer, payment, etc.)

---

## Railway vs Render - Key Differences

### Railway Advantages:
- ✅ Free tier includes PostgreSQL database
- ✅ Automatic `DATABASE_URL` setup
- ✅ Built-in shell access (free tier)
- ✅ Simpler setup
- ✅ Better free tier limits

### Configuration:
- **Root Directory:** `backend`
- **Build Command:** `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
- **Start Command:** `gunicorn gym_management.wsgi:application --bind 0.0.0.0:$PORT`

---

## Troubleshooting

### Database Connection Issues:
- Check `DATABASE_URL` is set (Railway adds it automatically)
- Verify PostgreSQL service is running

### CORS Errors:
- Update `CORS_ALLOWED_ORIGINS` with your Vercel URL
- Include protocol (`https://`)

### Migration Errors:
- Railway uses fresh database, so migrations should work normally
- If issues, check logs in Railway dashboard

---

## Quick Reference

- **Backend URL:** `https://your-service.railway.app`
- **Frontend URL:** `https://your-project.vercel.app`
- **Admin Panel:** `https://your-service.railway.app/admin/`

---

**Design & Development by [SansaTechSolution.com](https://sansatechsolution.com)**

