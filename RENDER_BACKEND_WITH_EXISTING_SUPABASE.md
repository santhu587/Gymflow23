# Create Backend on Render (You Already Have Supabase)

You have **Supabase resumed and healthy**. Follow these steps to create the **backend on Render** and connect it to that database.

---

## Step 1: Get your Supabase connection string

1. Go to **[supabase.com](https://supabase.com)** → open your **resumed project**.
2. Left sidebar → **Project Settings** (gear icon) → **Database**.
3. Scroll to **“Connection string”** → open the **“URI”** tab.
4. Copy the string. It looks like:
   ```text
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
   ```
5. **Replace `[YOUR-PASSWORD]`** with your **actual database password** (the one you set when you created the project). If you forgot it, use **Database** → **Reset database password** in Supabase, then use the new password in the URL.
6. Save this final URL — you’ll paste it into Render as `DATABASE_URL`.

---

## Step 2: Create the Web Service on Render

1. Go to **[dashboard.render.com](https://dashboard.render.com)** and log in.
2. Click **“New +”** → **“Web Service”**.
3. Connect **GitHub** if needed, then select your repo: **`Gymflow23`** (or your repo name) → **Connect**.
4. Use these settings:

| Field | Value |
|--------|--------|
| **Name** | `gymflow-backend` (or any name) |
| **Region** | Your choice |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate` |
| **Start Command** | `gunicorn gym_management.wsgi:application --bind 0.0.0.0:$PORT` |

5. Leave **Auto-Deploy** as **Yes** if you want deploys on every push.

---

## Step 3: Add environment variables (before first deploy)

Before (or right after) clicking **“Create Web Service”**, add these in the **Environment** section:

| Key | Value |
|-----|--------|
| `DATABASE_URL` | The full Supabase URI from Step 1 (with real password, no `[YOUR-PASSWORD]`) |
| `SECRET_KEY` | A long random string (e.g. run: `python -c "import secrets; print(secrets.token_urlsafe(50))"`) |
| `DEBUG` | `False` |
| `ALLOWED_HOSTS` | `*.render.com,gymflow-backend.onrender.com` (change `gymflow-backend` if you used a different name) |
| `CORS_ALLOWED_ORIGINS` | Your frontend URL, e.g. `https://gymflow23.vercel.app` (no trailing slash) |
| `PYTHON_VERSION` | `3.11.9` (optional but recommended) |

- **Important:** `DATABASE_URL` must be the **full** string with your real password. No quotes, no extra spaces.
- If your DB password has `@` or `#`, replace in the URL: `@` → `%40`, `#` → `%23`.

---

## Step 4: Create the service and wait for deploy

1. Click **“Create Web Service”** (or Save if you already created it).
2. Wait **3–5 minutes**. Watch the **Logs** tab.
3. You should see:
   - `Applying ... OK` for migrations (database is connected).
   - Then Gunicorn starting (e.g. `Booting worker with ...`).

---

## Step 5: Test the backend

- Open: **`https://gymflow-backend.onrender.com/api/`** (use your actual service name).
- You should get JSON like `"message": "GymFlow API"` and a list of endpoints. No 500 error.

---

## Step 6: Create admin user (so you can log in)

**Option A – Render Shell (if available)**  
In Render → your service → **Shell** → run:

```bash
python manage.py create_admin --username admin --email admin@gymflow.com --password admin123
```

**Option B – From your computer (using production DB)**  
Temporarily set in `backend/.env` the same `DATABASE_URL` as on Render, then:

```bash
cd backend
source venv/bin/activate
python manage.py create_admin --username admin --email admin@gymflow.com --password admin123
```

Then remove or change `DATABASE_URL` from local `.env` so local dev uses SQLite again.

---

## If something goes wrong

- **“DATABASE_URL must be set in production”** → Add `DATABASE_URL` in Render → Environment and redeploy.
- **Database connection / SSL error** → Double-check the Supabase URI: correct password, no `[YOUR-PASSWORD]` left, no extra spaces.
- **CORS errors from frontend** → Set `CORS_ALLOWED_ORIGINS` to the **exact** frontend URL (e.g. `https://gymflow23.vercel.app`), no trailing slash.

Your backend URL will be: **`https://<your-service-name>.onrender.com`**. Use this as `VITE_API_URL` in your frontend (e.g. on Vercel).
