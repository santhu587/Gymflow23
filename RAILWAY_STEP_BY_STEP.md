# 🚂 Railway Deployment - Step-by-Step Guide

## Step 2.4: Add PostgreSQL Database (Detailed)

### Visual Guide:

1. **In your Railway project dashboard**, you'll see your service (backend)

2. **Click "New" button** (usually at the top right or in the sidebar)
   - You'll see a dropdown menu

3. **Select "Database"** from the dropdown
   - Then click **"Add PostgreSQL"**

4. **Railway will automatically:**
   - Create a PostgreSQL database
   - Generate connection credentials
   - Add `DATABASE_URL` environment variable to your service
   - Link the database to your backend service

5. **Wait 1-2 minutes** for the database to be provisioned

6. **You'll see:**
   - A new PostgreSQL service in your project
   - The database is automatically connected to your backend

### What Happens:
- ✅ PostgreSQL database created
- ✅ `DATABASE_URL` automatically added to your backend service
- ✅ Database linked to your backend
- ✅ No manual configuration needed!

---

## Step 2.5: Add Environment Variables (Detailed)

### Step-by-Step:

1. **Go to your backend service** in Railway dashboard
   - Click on the service name (e.g., "gymflow-backend")

2. **Click on "Variables" tab**
   - You'll see a list of environment variables
   - `DATABASE_URL` should already be there (added automatically)

3. **Click "New Variable" or "+" button**

4. **Add each variable one by one:**

#### Variable 1: SECRET_KEY
- **Key:** `SECRET_KEY`
- **Value:** Generate a random string
  - You can use this command locally:
    ```bash
    python -c "import secrets; print(secrets.token_urlsafe(50))"
    ```
  - Or use: `django-insecure-gymflow23-secret-key-change-in-production-1234567890abcdef`
- Click **"Add"** or **"Save"**

#### Variable 2: DEBUG
- **Key:** `DEBUG`
- **Value:** `False`
- Click **"Add"**

#### Variable 3: ALLOWED_HOSTS
- **Key:** `ALLOWED_HOSTS`
- **Value:** `*.railway.app,your-service-name.railway.app`
  - Replace `your-service-name` with your actual service name
  - Or use: `*.railway.app` (allows all Railway domains)
- Click **"Add"**

#### Variable 4: CORS_ALLOWED_ORIGINS
- **Key:** `CORS_ALLOWED_ORIGINS`
- **Value:** `https://your-frontend.vercel.app`
  - You'll update this after deploying frontend
  - For now, you can use: `http://localhost:5173` (for testing)
- Click **"Add"**

### Example Environment Variables:

```
DATABASE_URL=postgresql://postgres:password@hostname:5432/railway
SECRET_KEY=django-insecure-gymflow23-secret-key-1234567890abcdef
DEBUG=False
ALLOWED_HOSTS=*.railway.app
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### After Adding Variables:

1. **Railway will automatically redeploy** your service
2. **Wait for deployment** (2-5 minutes)
3. **Check deployment logs** to ensure everything works

---

## Quick Checklist:

- [ ] PostgreSQL database added
- [ ] `DATABASE_URL` is automatically set (check Variables tab)
- [ ] `SECRET_KEY` added
- [ ] `DEBUG` set to `False`
- [ ] `ALLOWED_HOSTS` added
- [ ] `CORS_ALLOWED_ORIGINS` added (update after frontend deploy)

---

## Troubleshooting:

### Can't find "New" button?
- Look for **"+"** icon or **"Add"** button
- It might be in the top right corner or sidebar

### DATABASE_URL not showing?
- Wait a few minutes after adding PostgreSQL
- Refresh the page
- Check if database service is running (should show "Active")

### Variables not saving?
- Make sure you click "Add" or "Save" after each variable
- Check for typos in variable names (case-sensitive)

### Need to update a variable?
- Click on the variable in the list
- Edit the value
- Save changes
- Service will auto-redeploy

---

## Visual Reference:

**Railway Dashboard Layout:**
```
┌─────────────────────────────────────┐
│ Railway Project                     │
├─────────────────────────────────────┤
│ [Service: gymflow-backend]          │
│   ├── Deployments                   │
│   ├── Variables  ← Click here!      │
│   ├── Settings                      │
│   └── Metrics                       │
│                                     │
│ [Database: PostgreSQL]              │
│   └── (Auto-connected)              │
└─────────────────────────────────────┘
```

**Variables Tab:**
```
┌─────────────────────────────────────┐
│ Environment Variables               │
├─────────────────────────────────────┤
│ DATABASE_URL    [Auto-added]        │
│ SECRET_KEY      [Add manually]      │
│ DEBUG           [Add manually]       │
│ ALLOWED_HOSTS   [Add manually]      │
│ CORS_ALLOWED... [Add manually]      │
│                                     │
│ [+ New Variable]  ← Click to add    │
└─────────────────────────────────────┘
```

---

**Need more help?** Check the main `RAILWAY_DEPLOYMENT.md` guide for complete instructions.

