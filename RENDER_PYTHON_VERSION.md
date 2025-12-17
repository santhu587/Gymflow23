# 🐍 How to Force Python 3.11 on Render

## Issue
Render is using Python 3.13.4 by default, but we need Python 3.11.9 for compatibility.

## Solution Options

### Option 1: Environment Variable (Recommended)
In your Render service settings, add this environment variable:

**Key:** `PYTHON_VERSION`  
**Value:** `3.11.9`

This will force Render to use Python 3.11.9.

### Option 2: runtime.txt Location
Since your Root Directory is set to `backend`, the `runtime.txt` should be in:
- `backend/runtime.txt` ✅ (already exists)

But Render might also check the project root, so we have:
- `runtime.txt` ✅ (also exists)

### Option 3: Buildpack Specification
You can also specify in the build command, but environment variable is cleaner.

---

## Steps to Add Environment Variable

1. Go to your Render service dashboard
2. Click on your service (e.g., `gymflow-backend`)
3. Go to **"Environment"** tab
4. Click **"Add Environment Variable"**
5. Add:
   - **Key:** `PYTHON_VERSION`
   - **Value:** `3.11.9`
6. Click **"Save Changes"**
7. Service will auto-redeploy

---

## Verify Python Version

After deployment, check the build logs. You should see:
```
==> Installing Python version 3.11.9...
==> Using Python version 3.11.9
```

Instead of:
```
==> Installing Python version 3.13.4...
==> Using Python version 3.13.4
```

