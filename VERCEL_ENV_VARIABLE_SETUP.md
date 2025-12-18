# ⚙️ Fix: Frontend Using localhost Instead of Backend

## ❌ Error You're Seeing

```
POST http://localhost:8000/api/auth/register/ net::ERR_CONNECTION_REFUSED
```

**Problem:** Frontend is trying to connect to `localhost:8000` instead of your Render backend.

**Cause:** `VITE_API_URL` environment variable is not set in Vercel.

---

## ✅ Solution: Add Environment Variable in Vercel

### Step-by-Step Instructions

#### Step 1: Go to Vercel Dashboard

1. Open https://vercel.com/dashboard
2. Sign in if needed
3. Find your **frontend project** (Gymflow or similar name)
4. Click on it

#### Step 2: Go to Environment Variables

1. Click **"Settings"** tab (top navigation)
2. Click **"Environment Variables"** in the left sidebar
3. You'll see a list of environment variables (might be empty)

#### Step 3: Add VITE_API_URL

1. Click **"Add New"** button (or **"Add"** button)
2. Fill in:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://gymflow23.onrender.com`
   - **Environment:** 
     - ✅ Check **Production**
     - ✅ Check **Preview**
     - ✅ Check **Development**
3. Click **"Save"**

#### Step 4: Redeploy Frontend

**Option A: Manual Redeploy**
1. Go to **"Deployments"** tab
2. Find the latest deployment
3. Click the **"..."** (three dots) menu
4. Click **"Redeploy"**
5. Confirm redeploy

**Option B: Push New Commit (Auto-redeploy)**
1. Make a small change (or just push)
2. Vercel will auto-redeploy

---

## 🎯 Visual Guide

### Vercel Dashboard Navigation:
```
Vercel Dashboard
  ↓
Your Project (click it)
  ↓
Settings Tab
  ↓
Environment Variables (left sidebar)
  ↓
Add New Button
  ↓
Fill in:
  Key: VITE_API_URL
  Value: https://gymflow23.onrender.com
  Environment: All (Production, Preview, Development)
  ↓
Save
  ↓
Redeploy
```

---

## ✅ Verification

After redeploying, test:

1. **Open your Vercel frontend URL**
2. **Open browser DevTools** (F12)
3. **Go to Console tab**
4. **Try to register**
5. **Check the Network tab:**
   - Should see request to: `https://gymflow23.onrender.com/api/auth/register/`
   - NOT: `http://localhost:8000/api/auth/register/`

---

## 🔍 How to Check if It's Set

### In Vercel:
1. Settings → Environment Variables
2. You should see:
   ```
   VITE_API_URL = https://gymflow23.onrender.com
   ```

### In Browser (After Redeploy):
1. Open your Vercel frontend
2. Press F12 → Console
3. Type: `import.meta.env.VITE_API_URL`
4. Should show: `"https://gymflow23.onrender.com"`

---

## 🆘 Still Not Working?

### Issue 1: Environment Variable Not Showing
**Solution:**
- Make sure you selected all environments (Production, Preview, Development)
- Try redeploying again
- Check if variable name is exactly `VITE_API_URL` (case-sensitive)

### Issue 2: Still Using localhost
**Solution:**
- Clear browser cache
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check if redeploy completed successfully
- Verify environment variable is set correctly

### Issue 3: CORS Error After Fix
**Solution:**
- Update `CORS_ALLOWED_ORIGINS` in Render to include your Vercel URL
- See `FIX_VERCEL_FRONTEND.md` for details

---

## 📝 Quick Checklist

- [ ] Went to Vercel Dashboard
- [ ] Selected frontend project
- [ ] Settings → Environment Variables
- [ ] Added: `VITE_API_URL` = `https://gymflow23.onrender.com`
- [ ] Selected all environments (Production, Preview, Development)
- [ ] Saved
- [ ] Redeployed frontend
- [ ] Tested registration (should work now!)

---

## 💡 Important Notes

1. **Environment variable name must be:** `VITE_API_URL` (exact, case-sensitive)
2. **Value must be:** `https://gymflow23.onrender.com` (no trailing slash)
3. **Must redeploy** after adding environment variable
4. **Vite requires** environment variables to start with `VITE_` to be exposed to frontend

---

## 🎯 What Happens After Fix

**Before:**
```
Frontend → http://localhost:8000/api/auth/register/ ❌
```

**After:**
```
Frontend → https://gymflow23.onrender.com/api/auth/register/ ✅
```

---

**After setting `VITE_API_URL` in Vercel and redeploying, your frontend will connect to the correct backend!**

