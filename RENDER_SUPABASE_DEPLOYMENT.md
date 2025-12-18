# 🚀 Render + Supabase/Neon PostgreSQL Deployment Guide

Complete guide to deploy Django backend to Render with Supabase or Neon PostgreSQL database.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Set Up Database (Supabase or Neon)](#step-1-set-up-database)
3. [Step 2: Deploy Django to Render](#step-2-deploy-django-to-render)
4. [Step 3: Configure Environment Variables](#step-3-configure-environment-variables)
5. [Step 4: Deploy and Test](#step-4-deploy-and-test)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- ✅ GitHub account
- ✅ Render account (sign up at https://render.com)
- ✅ Supabase account (https://supabase.com) OR Neon account (https://neon.tech)
- ✅ Code pushed to GitHub repository

---

## Step 1: Set Up Database

Choose one: **Supabase** or **Neon**

### Option A: Supabase PostgreSQL

#### 1.1 Create Supabase Account
1. Go to https://supabase.com
2. Sign up with GitHub
3. Click **"New Project"**

#### 1.2 Create Project
1. **Project Name:** `gymflow-db` (or any name)
2. **Database Password:** Create a strong password (save it!)
3. **Region:** Choose closest to your users
4. Click **"Create new project"**
5. Wait 2-3 minutes for database to be created

#### 1.3 Get Connection String
1. Go to **Project Settings** → **Database**
2. Scroll to **"Connection string"** section
3. Click **"URI"** tab
4. Copy the connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
5. **Replace `[YOUR-PASSWORD]`** with your actual database password
6. **Save this string** - you'll need it for Render

#### 1.4 Enable Connection Pooling (Optional but Recommended)
1. In Supabase dashboard, go to **Project Settings** → **Database**
2. Find **"Connection Pooling"** section
3. Copy the **"Session"** connection string
4. Use this instead of the regular connection string for better performance

---

### Option B: Neon PostgreSQL

#### 1.1 Create Neon Account
1. Go to https://neon.tech
2. Sign up with GitHub
3. Click **"Create a project"**

#### 1.2 Create Project
1. **Project Name:** `gymflow-db` (or any name)
2. **PostgreSQL Version:** 15 (recommended)
3. **Region:** Choose closest to your users
4. Click **"Create project"**
5. Wait 1-2 minutes for database to be created

#### 1.3 Get Connection String
1. After project creation, you'll see the **"Connection string"**
2. It looks like:
   ```
   postgresql://username:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
3. **Copy this string** - you'll need it for Render
4. Neon automatically includes SSL, which is good for security

#### 1.4 Enable Connection Pooling (Optional but Recommended)
1. In Neon dashboard, go to **"Connection Details"**
2. Toggle **"Pooled connection"**
3. Copy the pooled connection string
4. Use this for better performance

---

## Step 2: Deploy Django to Render

### 2.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Connect your GitHub account

### 2.2 Create New Web Service
1. In Render dashboard, click **"New +"**
2. Select **"Web Service"**
3. Connect your GitHub repository: `santhu587/Gymflow23`
4. Click **"Connect"**

### 2.3 Configure Service Settings

**Basic Settings:**
- **Name:** `gymflow-backend` (or any name)
- **Region:** Choose closest to your users
- **Branch:** `main`
- **Root Directory:** `backend`

**Build & Deploy:**
- **Runtime:** `Python 3`
- **Build Command:**
  ```bash
  pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
  ```
- **Start Command:**
  ```bash
  gunicorn gym_management.wsgi:application --bind 0.0.0.0:$PORT
  ```

**Advanced Settings:**
- **Auto-Deploy:** `Yes` (deploys on every push to main)
- **Health Check Path:** `/api/` (optional)

Click **"Create Web Service"**

---

## Step 3: Configure Environment Variables

### 3.1 Add Environment Variables in Render

Go to your service → **"Environment"** tab → Add these variables:

#### Required Variables:

**1. DATABASE_URL**
- **Key:** `DATABASE_URL`
- **Value:** Your Supabase or Neon connection string
  - Supabase: `postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres`
  - Neon: `postgresql://username:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require`
- **Important:** Replace password with actual password!

**2. SECRET_KEY**
- **Key:** `SECRET_KEY`
- **Value:** Generate a random secret key:
  ```bash
  python -c "import secrets; print(secrets.token_urlsafe(50))"
  ```
- Or use: `django-insecure-gymflow23-secret-key-change-in-production-1234567890abcdef`

**3. DEBUG**
- **Key:** `DEBUG`
- **Value:** `False` (for production)

**4. ALLOWED_HOSTS**
- **Key:** `ALLOWED_HOSTS`
- **Value:** `*.render.com,your-service-name.onrender.com`
- Replace `your-service-name` with your actual Render service name

**5. CORS_ALLOWED_ORIGINS**
- **Key:** `CORS_ALLOWED_ORIGINS`
- **Value:** `http://localhost:5173` (update after frontend deploy)
- After Vercel deploy, change to: `https://your-frontend.vercel.app`

**6. PYTHON_VERSION** (Optional - if you need specific version)
- **Key:** `PYTHON_VERSION`
- **Value:** `3.11.9` (or your preferred version)

### 3.2 Example Environment Variables:

```
DATABASE_URL=postgresql://postgres:yourpassword@db.xxxxx.supabase.co:5432/postgres
SECRET_KEY=django-insecure-gymflow23-secret-key-1234567890abcdef
DEBUG=False
ALLOWED_HOSTS=*.render.com,gymflow-backend.onrender.com
CORS_ALLOWED_ORIGINS=http://localhost:5173
PYTHON_VERSION=3.11.9
```

---

## Step 4: Deploy and Test

### 4.1 Deploy
1. After adding environment variables, Render will **automatically redeploy**
2. Wait 3-5 minutes for build to complete
3. Check **"Logs"** tab for any errors

### 4.2 Test Deployment

**1. Check Health:**
- Visit: `https://your-service-name.onrender.com/api/`
- Should return API response or 404 (not 500 error)

**2. Test Database Connection:**
- Check logs for: `Operations to perform: Apply all migrations`
- Should see: `Running migrations...` and `OK`

**3. Create Superuser (Optional):**
- Use Render Shell (if available) or local connection:
  ```bash
  python manage.py createsuperuser
  ```

### 4.3 Get Your Backend URL

Your backend will be available at:
```
https://your-service-name.onrender.com
```

API endpoints:
```
https://your-service-name.onrender.com/api/
```

---

## Troubleshooting

### Issue 1: Build Fails - "ModuleNotFoundError: No module named 'pkg_resources'"
**Solution:**
- Make sure `setuptools>=65.5.0` is in `requirements.txt` ✅ (already added)

### Issue 2: Database Connection Error
**Solution:**
1. Check `DATABASE_URL` is correct
2. Verify password doesn't have special characters (URL encode if needed)
3. For Supabase: Make sure you replaced `[YOUR-PASSWORD]` in connection string
4. For Neon: Connection string should include `?sslmode=require`

### Issue 3: Migration Errors
**Solution:**
- If you see `InconsistentMigrationHistory`:
  - This is a fresh database, so it shouldn't happen
  - If it does, you can reset migrations (see below)

### Issue 4: Static Files Not Loading
**Solution:**
- Make sure `whitenoise` is in `requirements.txt` ✅ (already added)
- Check `collectstatic` runs in build command ✅ (already added)

### Issue 5: CORS Errors
**Solution:**
- Update `CORS_ALLOWED_ORIGINS` with your frontend URL
- Make sure frontend URL is exact (no trailing slash)

### Issue 6: Service Keeps Crashing
**Solution:**
1. Check logs for error messages
2. Verify all environment variables are set
3. Make sure `DATABASE_URL` is correct
4. Check if database is accessible from Render's IP

---

## Database Reset (If Needed)

If you need to reset your database:

### For Supabase:
1. Go to **SQL Editor** in Supabase dashboard
2. Run:
   ```sql
   DROP SCHEMA public CASCADE;
   CREATE SCHEMA public;
   GRANT ALL ON SCHEMA public TO postgres;
   GRANT ALL ON SCHEMA public TO public;
   ```
3. Redeploy on Render (migrations will run automatically)

### For Neon:
1. Go to **Branches** in Neon dashboard
2. Create a new branch (fresh database)
3. Update `DATABASE_URL` in Render with new branch connection string
4. Redeploy on Render

---

## Next Steps

1. ✅ Backend deployed to Render
2. ✅ Database connected (Supabase/Neon)
3. ⏭️ Deploy frontend to Vercel
4. ⏭️ Update `CORS_ALLOWED_ORIGINS` with Vercel URL
5. ⏭️ Update frontend `VITE_API_URL` with Render backend URL

---

## Quick Reference

**Supabase Connection String Format:**
```
postgresql://postgres:YOUR_PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres
```

**Neon Connection String Format:**
```
postgresql://USERNAME:PASSWORD@ep-XXXXX.REGION.aws.neon.tech/neondb?sslmode=require
```

**Render Service URL:**
```
https://SERVICE_NAME.onrender.com
```

**Environment Variables Checklist:**
- [ ] DATABASE_URL (from Supabase/Neon)
- [ ] SECRET_KEY (random string)
- [ ] DEBUG=False
- [ ] ALLOWED_HOSTS (*.render.com)
- [ ] CORS_ALLOWED_ORIGINS (frontend URL)
- [ ] PYTHON_VERSION (optional)

---

**Need help?** Check the logs in Render dashboard or create an issue in your GitHub repo.

