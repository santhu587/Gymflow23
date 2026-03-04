# Update Frontend for Production Backend

Use this after your backend is live on Render (e.g. `https://gymflow23-1.onrender.com`).

---

## 1. Set API URL in your frontend host (e.g. Vercel)

1. Open your **frontend** project on **Vercel** (or Netlify, etc.).
2. Go to **Settings → Environment Variables**.
3. Add (or edit):
   - **Name:** `VITE_API_URL`
   - **Value:** `https://gymflow23-1.onrender.com`  
     (no `/api`, no trailing slash — your actual Render backend URL.)
4. **Redeploy** the frontend (Deployments → ⋮ → Redeploy) so the new variable is used in the build.

---

## 2. Allow your frontend in backend CORS (Render)

1. Open **Render** → your **backend** service → **Environment**.
2. Set **CORS_ALLOWED_ORIGINS** to your frontend URL, e.g.:
   - `https://gymflow23.vercel.app`  
     (or whatever your Vercel app URL is; no trailing slash.)
3. Save. Render will redeploy the backend.

---

## 3. Local development

To keep using the local backend while developing:

- In `frontend/.env` (create if missing):  
  `VITE_API_URL=http://localhost:8000`
- The app already falls back to `http://localhost:8000` if `VITE_API_URL` is not set.

---

## Summary

| Where        | Variable             | Example value                          |
|-------------|----------------------|----------------------------------------|
| **Vercel**  | `VITE_API_URL`       | `https://gymflow23-1.onrender.com`     |
| **Render**  | `CORS_ALLOWED_ORIGINS` | `https://your-app.vercel.app`       |

After both are set and you redeploy frontend and backend, the production site will use the Render API.
