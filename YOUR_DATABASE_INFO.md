# 📋 Your Database Information

## Database Details

- **Name:** `lmsdatabase`
- **Status:** Available ✅
- **Region:** Singapore (Southeast Asia)
- **PostgreSQL Version:** 18
- **Instance Type:** Free (256 MB RAM, 0.1 CPU, 1 GB Storage)

## Connection Information

### Internal Database URL (Use This for Render!)
```
postgresql://lmsdatabase_tczd_user:pPmCGTNBHiVHmzMFcECLXgYVYkOABsCq@dpg-d4iai0euk2gs7385impg-a/lmsdatabase_tczd
```

### Connection Details
- **Hostname:** `dpg-d4iai0euk2gs7385impg-a`
- **Port:** `5432`
- **Database:** `lmsdatabase_tczd`
- **Username:** `lmsdatabase_tczd_user`
- **Password:** `pPmCGTNBHiVHmzMFcECLXgYVYkOABsCq`

---

## 🔗 How to Use This in Your Backend Deployment

### Step 1: Deploy Backend on Render

1. Go to: https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repo: `santhu587/Gymflow23`
4. Configure:
   - **Name:** `gymflow-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:**
     ```bash
     pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
     ```
   - **Start Command:**
     ```bash
     gunicorn gym_management.wsgi:application --bind 0.0.0.0:$PORT
     ```

### Step 2: Add Environment Variables

Click **"Add Environment Variable"** and add:

**1. DATABASE_URL** ⭐ (MOST IMPORTANT!)
- **Key:** `DATABASE_URL`
- **Value:** 
  ```
  postgresql://lmsdatabase_tczd_user:pPmCGTNBHiVHmzMFcECLXgYVYkOABsCq@dpg-d4iai0euk2gs7385impg-a/lmsdatabase_tczd
  ```
  (Copy the entire Internal Database URL above)

**2. SECRET_KEY**
- **Key:** `SECRET_KEY`
- **Value:** Generate a random string (run this locally):
  ```bash
  python -c "import secrets; print(secrets.token_urlsafe(50))"
  ```
  Or use: `django-insecure-gymflow-secret-key-change-in-production-1234567890abcdef`

**3. DEBUG**
- **Key:** `DEBUG`
- **Value:** `False`

**4. ALLOWED_HOSTS**
- **Key:** `ALLOWED_HOSTS`
- **Value:** `gymflow-backend.onrender.com` (or your service name + `.onrender.com`)

**5. CORS_ALLOWED_ORIGINS** (Add after frontend deploy)
- **Key:** `CORS_ALLOWED_ORIGINS`
- **Value:** `https://your-frontend.vercel.app` (update after frontend deploy)

### Step 3: Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Django will automatically:
   - Connect to your database
   - Run migrations (create tables)
   - Start the server

---

## ✅ Verification

After deployment, check:

1. **Build Logs:**
   - Should see: `Running migrations...`
   - Should see: `Operations to perform:`
   - Should see: `Applying migrations...` ✅

2. **Database Tables:**
   - Go to your database dashboard → "Shell" tab
   - Run: `\dt`
   - Should see Django tables created

3. **API Test:**
   - Visit: `https://gymflow-backend.onrender.com/api/`
   - Should see API response

---

## 🔒 Security Note

⚠️ **Important:** The password and connection details are sensitive. Keep them secure!

- ✅ Safe to use in Render environment variables (they're encrypted)
- ❌ Don't commit to GitHub
- ❌ Don't share publicly

---

## 📝 Quick Reference

**Internal Database URL (Copy this for DATABASE_URL):**
```
postgresql://lmsdatabase_tczd_user:pPmCGTNBHiVHmzMFcECLXgYVYkOABsCq@dpg-d4iai0euk2gs7385impg-a/lmsdatabase_tczd
```

**Your Backend URL (after deployment):**
```
https://gymflow-backend.onrender.com
```

---

**Next Steps:**
1. ✅ Deploy backend with DATABASE_URL
2. 📱 Deploy frontend to Vercel
3. 🔗 Update CORS_ALLOWED_ORIGINS
4. 🎉 Test your application!

