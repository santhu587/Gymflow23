# Complete Guide: Deploy GymFlow Backend to Production (Render + PostgreSQL)

This guide takes you from zero to a **live Django backend** on Render with a **PostgreSQL database** (Supabase or Neon). Follow the steps in order.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Part A: Create the Database](#2-part-a-create-the-database)
3. [Part B: Deploy Backend to Render](#3-part-b-deploy-backend-to-render)
4. [Part C: Environment Variables](#4-part-c-environment-variables)
5. [Part D: Deploy and Verify](#5-part-d-deploy-and-verify)
6. [Part E: Create Admin User](#6-part-e-create-admin-user)
7. [Part F: Connect Your Frontend](#7-part-f-connect-your-frontend)
8. [Troubleshooting](#8-troubleshooting)
9. [Quick Reference](#9-quick-reference)

---

## 1. Prerequisites

Before starting, ensure you have:

| Requirement | Details |
|-------------|---------|
| **GitHub** | Your GymFlow code in a repo (e.g. `santhu587/Gymflow23`) |
| **Render account** | Free at [render.com](https://render.com) — sign up with GitHub |
| **Database provider** | **Supabase** ([supabase.com](https://supabase.com)) **or** **Neon** ([neon.tech](https://neon.tech)) — free tier is enough |

---

## 2. Part A: Create the Database

You need a **PostgreSQL** database. Choose **one** option below.

### Option 1: Supabase (recommended)

1. Go to **[supabase.com](https://supabase.com)** and sign in (e.g. with GitHub).
2. Click **“New Project”**.
3. Fill in:
   - **Name:** `gymflow-db` (or any name)
   - **Database Password:** Choose a **strong password** and **save it** (you need it for `DATABASE_URL`)
   - **Region:** Pick one close to your users
4. Click **“Create new project”** and wait 2–3 minutes.
5. Get the connection string:
   - Left sidebar → **Project Settings** (gear icon).
   - Click **“Database”**.
   - Scroll to **“Connection string”**.
   - Select the **“URI”** tab.
   - Copy the string. It looks like:
     ```text
     postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
     ```
   - **Replace `[YOUR-PASSWORD]`** with the database password you set in step 3.
   - Save this final string somewhere safe — you’ll paste it into Render as `DATABASE_URL`.

**Example (fake):**
```text
postgresql://postgres:MyStr0ngP@ss@db.abcdefghijk.supabase.co:5432/postgres
```

---

### Option 2: Neon

1. Go to **[neon.tech](https://neon.tech)** and sign in (e.g. with GitHub).
2. Click **“New Project”**.
3. Set **Project name** (e.g. `gymflow-db`), **Region**, and click **“Create project”**.
4. On the next screen you’ll see **“Connection string”**.
5. Copy the connection string. It should already include `?sslmode=require`, for example:
   ```text
   postgresql://username:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
6. Save this string — you’ll use it as `DATABASE_URL` on Render.

---

## 3. Part B: Deploy Backend to Render

1. Go to **[dashboard.render.com](https://dashboard.render.com)** and log in.
2. Click **“New +”** → **“Web Service”**.
3. **Connect repository:**
   - If prompted, connect your **GitHub** account and allow Render to access your repos.
   - Select the repo that contains GymFlow (e.g. `Gymflow23`).
   - Click **“Connect”**.
4. **Configure the service** exactly as below.

### Basic settings

| Field | Value |
|-------|--------|
| **Name** | `gymflow-backend` (or any name; this becomes part of your URL) |
| **Region** | Choose closest to your users |
| **Branch** | `main` |
| **Root Directory** | `backend` |

### Build & Deploy

| Field | Value |
|-------|--------|
| **Runtime** | `Python 3` |
| **Build Command** | (copy exactly) |
| | `pip install -r requirements.txt && python manage.py collectstatic --noinput` |
| **Start Command** | (copy exactly) |
| | `python manage.py migrate --noinput && gunicorn gym_management.wsgi:application --bind 0.0.0.0:$PORT` |

**Why migrations are in Start, not Build:** Render's build environment often cannot reach external databases (Supabase/Neon), so running `migrate` during build can fail with "Network is unreachable". Running `migrate` at startup ensures the running container (which has network access) applies migrations before Gunicorn starts.

### Optional

- **Auto-Deploy:** `Yes` (so each push to `main` redeploys).
- **Health Check Path:** leave empty or set to `/api/`.

5. **Do not** click “Create Web Service” yet. First add environment variables (Part C), then create the service, or add them immediately after creation so the first deploy succeeds.

---

## 4. Part C: Environment Variables

In Render, open your service → **“Environment”** tab → **“Add Environment Variable”**. Add every variable below.

### Required variables

| Key | Value | Notes |
|-----|--------|--------|
| `DATABASE_URL` | Your **full** Supabase or Neon connection string | From Part A. No spaces; replace password. |
| `SECRET_KEY` | A long random string | Generate: `python -c "import secrets; print(secrets.token_urlsafe(50))"` or use a long random phrase. |
| `DEBUG` | `False` | Must be `False` in production. |
| `ALLOWED_HOSTS` | `*.render.com,gymflow-backend.onrender.com` | Replace `gymflow-backend` with your **Render service name** if different. |
| `CORS_ALLOWED_ORIGINS` | Your frontend URL | e.g. `https://gymflow23.vercel.app` or `https://your-app.vercel.app`. No trailing slash. If frontend not deployed yet, use `http://localhost:5173` and update later. |

### Required on Render (avoid Python 3.14 build error)

| Key | Value |
|-----|--------|
| `PYTHON_VERSION` | `3.11.9` |

Render may default to Python 3.14, which breaks `djangorestframework-simplejwt` (missing `pkg_resources`). Setting `PYTHON_VERSION=3.11.9` fixes the build.

### Example (replace with your real values)

```env
DATABASE_URL=postgresql://postgres:YourActualPassword@db.xxxxxxxx.supabase.co:5432/postgres
SECRET_KEY=your-50-char-secret-key-from-secrets.token_urlsafe
DEBUG=False
ALLOWED_HOSTS=*.render.com,gymflow-backend.onrender.com
CORS_ALLOWED_ORIGINS=https://gymflow23.vercel.app
PYTHON_VERSION=3.11.9
```

### Password with special characters

If your database password contains `@`, `#`, `/`, `%`, etc., **URL-encode** them in `DATABASE_URL`:

| Character | Encoded |
|-----------|---------|
| `@` | `%40` |
| `#` | `%23` |
| `/` | `%2F` |
| `%` | `%25` |

Example: password `P@ss#123` → in the URL use `P%40ss%23123`.

---

## 5. Part D: Deploy and Verify

1. **Create the service** (if you didn’t already) or **Save** environment variables. Render will start a deploy.
2. Wait **3–5 minutes**. Watch the **“Logs”** tab.
3. **Check logs for success:**
   - You should see: `pip install -r requirements.txt ...`
   - Then: `Applying ... OK` for migrations.
   - Then: `Booting worker with ...` or similar (Gunicorn started).
4. **Test the API:**
   - Open in browser: `https://gymflow-backend.onrender.com/api/`  
     (replace `gymflow-backend` with your service name.)
   - You should get JSON with something like `"message": "GymFlow API"` and list of endpoints. **No 500 error.**

If you see **“DATABASE_URL must be set in production”** or database errors, go to [Troubleshooting](#8-troubleshooting).

---

## 6. Part E: Create Admin User

You need at least one user to log in (app and Django admin).

### Option A: Render Shell (if available)

1. In Render dashboard → your service → **“Shell”** (or “Start a Shell”).
2. Run:
   ```bash
   python manage.py create_admin --username admin --email admin@gymflow.com --password admin123
   ```
3. You should see: `✅ Superuser "admin" created successfully!`

### Option B: One-off job or local with production DB

If Render doesn’t give you a shell:

1. **Temporarily** set in your **local** `.env` (in `backend/`):
   - `DATABASE_URL` = same value as on Render (your Supabase/Neon URL).
   - `DEBUG=False` (optional).
2. From project root, in `backend/`:
   ```bash
   cd backend
   source venv/bin/activate   # or: venv\Scripts\activate on Windows
   python manage.py create_admin --username admin --email admin@gymflow.com --password admin123
   ```
3. Remove or revert `DATABASE_URL` from local `.env` so local dev uses SQLite again.

**Login credentials:**

- **Username:** `admin`
- **Password:** `admin123` (or whatever you passed to `--password`)

Use these for:
- **App login:** your frontend (e.g. Vercel) → Login page.
- **Django admin:** `https://gymflow-backend.onrender.com/admin/`

---

## 7. Part F: Connect Your Frontend

1. Deploy your frontend (e.g. Vercel) and set **one** environment variable there:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://gymflow-backend.onrender.com`  
     (no `/api`, no trailing slash; replace with your Render URL.)
2. Redeploy the frontend so it picks up `VITE_API_URL`.
3. On Render, ensure **CORS** includes your frontend:
   - **Key:** `CORS_ALLOWED_ORIGINS`
   - **Value:** `https://your-actual-frontend.vercel.app` (exact URL, no trailing slash).
4. Redeploy the backend if you changed `CORS_ALLOWED_ORIGINS`.

---

## 8. Troubleshooting

### “DATABASE_URL must be set in production”

- **Cause:** `DEBUG=False` and `DATABASE_URL` is not set on Render.
- **Fix:** Render → your service → **Environment** → add `DATABASE_URL` with your Supabase or Neon connection string → Save (triggers redeploy).

### Build fails: “Error: pg_config executable not found” / psycopg2

- **Cause:** Render is trying to build `psycopg2` from source and failing.
- **Fix:** Ensure `psycopg2-binary==2.9.9` is in `backend/requirements.txt`. Render’s Python image usually has build tools; if it still fails, try setting **Environment** → `PYTHON_VERSION` = `3.11.9` and redeploy.

### Database connection error / “SSL required” / “connection refused”

- **Fix 1:** Double-check `DATABASE_URL`: correct host, username, password, no extra spaces. For **Neon**, the URL must include `?sslmode=require`.
- **Fix 2:** **Supabase:** Project Settings → Database → copy the **URI** again and replace `[YOUR-PASSWORD]` with your real password.
- **Fix 3:** If the password has special characters, URL-encode them in `DATABASE_URL` (see [Password with special characters](#password-with-special-characters)).
- **Fix 4:** In Render **Logs**, look for the exact error (e.g. “SSL connection required”) and fix the URL or add `?sslmode=require` for Postgres.

### Migrations fail (e.g. “InconsistentMigrationHistory”)

- For a **new** database this is rare. If you see it after resetting the DB:
  - **Supabase:** SQL Editor → run (this wipes the public schema):
    ```sql
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
    GRANT ALL ON SCHEMA public TO postgres;
    GRANT ALL ON SCHEMA public TO public;
    ```
  - Then on Render: **Manual Deploy** → “Clear build cache & deploy” so migrations run again on a clean schema.

### CORS errors in browser (frontend can’t call API)

- **Fix:** Render → **Environment** → `CORS_ALLOWED_ORIGINS` must be **exactly** your frontend origin, e.g. `https://gymflow23.vercel.app` (no trailing slash, same protocol and domain as in the browser). Redeploy backend after changing.

### Service keeps crashing or 503

- Open **Logs** and read the last lines (often a Python traceback).
- Typical causes: missing `DATABASE_URL`, wrong `SECRET_KEY`, or an exception in app code. Fix the reported error and redeploy.

---

## 9. Quick Reference

### Render service URL

```text
https://<YOUR-SERVICE-NAME>.onrender.com
```

Example: `https://gymflow-backend.onrender.com`

### Important endpoints

| Endpoint | Purpose |
|----------|---------|
| `https://...onrender.com/api/` | API info / health |
| `https://...onrender.com/api/auth/login/` | Login (POST username + password) |
| `https://...onrender.com/admin/` | Django admin (browser) |

### Environment variables checklist (Render)

- [ ] `DATABASE_URL` — Supabase or Neon connection string
- [ ] `SECRET_KEY` — long random string
- [ ] `DEBUG` — `False`
- [ ] `ALLOWED_HOSTS` — `*.render.com,<your-service-name>.onrender.com`
- [ ] `CORS_ALLOWED_ORIGINS` — frontend URL (e.g. Vercel)
- [ ] `PYTHON_VERSION` — `3.11.9` (optional)

### Build and start commands (copy-paste)

**Build:**

```bash
pip install -r requirements.txt && python manage.py collectstatic --noinput
```

**Start:**

```bash
python manage.py migrate --noinput && gunicorn gym_management.wsgi:application --bind 0.0.0.0:$PORT
```

---

After following this guide you should have:

- Backend running on Render
- PostgreSQL (Supabase or Neon) connected and migrated
- Admin user created
- Frontend pointed at the backend and CORS set

For more detail on Supabase/Neon or advanced options, see `RENDER_SUPABASE_DEPLOYMENT.md`.
