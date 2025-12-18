# 🔧 Fix: Vercel Frontend Not Working - Registration Issue

## ❌ Problem

Frontend on Vercel is not working, can't register.

**Common causes:**
1. `VITE_API_URL` not set in Vercel
2. CORS not configured for Vercel domain
3. Backend URL not accessible

---

## ✅ Solution 1: Configure Vercel Environment Variables

### Step 1: Get Your Backend URL

Your backend is at: `https://gymflow23.onrender.com`

### Step 2: Add Environment Variable in Vercel

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Select your **frontend project**
3. Go to **Settings** → **Environment Variables**
4. Click **"Add New"**
5. Add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://gymflow23.onrender.com`
   - **Environment:** Production, Preview, Development (select all)
6. Click **"Save"**

### Step 3: Redeploy

1. After adding the environment variable
2. Go to **Deployments** tab
3. Click **"Redeploy"** on the latest deployment
4. Or push a new commit to trigger redeploy

---

## ✅ Solution 2: Update CORS in Render Backend

Your backend needs to allow requests from your Vercel frontend.

### Step 1: Get Your Vercel Frontend URL

Your Vercel frontend URL will be something like:
- `https://your-project.vercel.app`
- Or your custom domain

### Step 2: Update CORS_ALLOWED_ORIGINS in Render

1. Go to **Render** → Your Backend Service → **Environment** tab
2. Find `CORS_ALLOWED_ORIGINS`
3. Update it to include your Vercel URL:
   ```
   https://your-frontend.vercel.app,http://localhost:5173
   ```
   Replace `your-frontend.vercel.app` with your actual Vercel URL
4. Click **"Save"**
5. Render will auto-redeploy

**Example:**
If your Vercel URL is `https://gymflow-frontend.vercel.app`:
```
https://gymflow-frontend.vercel.app,http://localhost:5173
```

---

## ✅ Solution 3: Check Backend is Working

Test your backend API:

1. **Test root endpoint:**
   ```bash
   curl https://gymflow23.onrender.com/
   ```
   Should return JSON with API info

2. **Test registration endpoint:**
   ```bash
   curl -X POST https://gymflow23.onrender.com/api/auth/register/ \
     -H "Content-Type: application/json" \
     -d '{"username":"test","email":"test@test.com","password":"test123"}'
   ```

3. **Check browser console:**
   - Open your Vercel frontend
   - Open browser DevTools (F12)
   - Go to **Console** tab
   - Try to register
   - Check for error messages

---

## 🎯 Complete Setup Checklist

### Vercel Configuration:
- [ ] `VITE_API_URL` environment variable set to `https://gymflow23.onrender.com`
- [ ] Environment variable added to Production, Preview, and Development
- [ ] Frontend redeployed after adding environment variable

### Render Backend Configuration:
- [ ] `CORS_ALLOWED_ORIGINS` includes your Vercel frontend URL
- [ ] `ALLOWED_HOSTS` includes `*.render.com,gymflow23.onrender.com`
- [ ] Backend is live and accessible

### Testing:
- [ ] Backend root URL works: `https://gymflow23.onrender.com/`
- [ ] Frontend can reach backend (check browser console)
- [ ] Registration form works

---

## 🔍 Debugging Steps

### Step 1: Check Browser Console

1. Open your Vercel frontend
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Try to register
5. Look for errors:
   - **CORS error?** → Update `CORS_ALLOWED_ORIGINS` in Render
   - **Network error?** → Check `VITE_API_URL` in Vercel
   - **404 error?** → Check backend URL is correct

### Step 2: Check Network Tab

1. In DevTools, go to **Network** tab
2. Try to register
3. Look for the registration request
4. Check:
   - **Request URL:** Should be `https://gymflow23.onrender.com/api/auth/register/`
   - **Status:** Should be 200 or 201 (not 400, 404, or CORS error)

### Step 3: Test API Directly

Open browser and go to:
```
https://gymflow23.onrender.com/api/auth/register/
```

Should return an error about missing data (not 404 or CORS error).

---

## 📝 Environment Variables Summary

### Vercel (Frontend):
```
VITE_API_URL=https://gymflow23.onrender.com
```

### Render (Backend):
```
DATABASE_URL=postgresql://postgres.dernkumctxpnlsveobzi:Santhu%40587@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=*.render.com,gymflow23.onrender.com
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:5173
```

**Important:** Replace `your-frontend.vercel.app` with your actual Vercel URL!

---

## 🆘 Common Errors and Fixes

### Error 1: "Network Error" or "Failed to fetch"
**Cause:** `VITE_API_URL` not set in Vercel
**Fix:** Add `VITE_API_URL=https://gymflow23.onrender.com` in Vercel

### Error 2: "CORS policy" error
**Cause:** Backend not allowing Vercel domain
**Fix:** Add Vercel URL to `CORS_ALLOWED_ORIGINS` in Render

### Error 3: "404 Not Found"
**Cause:** Wrong API URL
**Fix:** Check `VITE_API_URL` is `https://gymflow23.onrender.com` (no trailing slash)

### Error 4: "400 Bad Request"
**Cause:** Backend issue or wrong data format
**Fix:** Check backend logs in Render, verify request format

---

## ✅ Quick Fix Steps

1. **Vercel:**
   - Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://gymflow23.onrender.com`
   - Redeploy

2. **Render:**
   - Environment → `CORS_ALLOWED_ORIGINS`
   - Add your Vercel URL
   - Save (auto-redeploys)

3. **Test:**
   - Open Vercel frontend
   - Try to register
   - Check browser console for errors

---

**After configuring both Vercel and Render, your frontend should work!**

