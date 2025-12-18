# 🔗 Database Connection String Guide

Quick reference for getting PostgreSQL connection strings from Supabase and Neon.

---

## 🟢 Supabase PostgreSQL

### Step 1: Get Connection String

1. Go to your Supabase project dashboard
2. Click **"Project Settings"** (gear icon in sidebar)
3. Go to **"Database"** section
4. Scroll to **"Connection string"**
5. Click **"URI"** tab
6. Copy the connection string

### Step 2: Format

**Template:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**Example:**
```
postgresql://postgres:mypassword123@db.abcdefghijklmnop.supabase.co:5432/postgres
```

### Step 3: Replace Password

⚠️ **Important:** The connection string has `[YOUR-PASSWORD]` placeholder. Replace it with your actual database password!

**How to find your password:**
- It's the password you set when creating the Supabase project
- If you forgot it, go to **Project Settings** → **Database** → **Reset database password**

### Step 4: Connection Pooling (Recommended)

For better performance, use connection pooling:

1. In **Project Settings** → **Database**
2. Find **"Connection Pooling"** section
3. Copy the **"Session"** connection string
4. It looks like:
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

---

## 🔵 Neon PostgreSQL

### Step 1: Get Connection String

1. Go to your Neon project dashboard
2. After creating a project, you'll see the connection string immediately
3. Or go to **"Connection Details"** in the sidebar
4. Copy the connection string

### Step 2: Format

**Template:**
```
postgresql://[USERNAME]:[PASSWORD]@[ENDPOINT].neon.tech/[DATABASE]?sslmode=require
```

**Example:**
```
postgresql://neondb_owner:password123@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### Step 3: Connection Pooling (Recommended)

1. In **"Connection Details"**
2. Toggle **"Pooled connection"** ON
3. Copy the pooled connection string
4. It includes `?sslmode=require` automatically

### Step 4: SSL Mode

Neon requires SSL, so connection string must include:
- `?sslmode=require` (included by default)

---

## ✅ Testing Your Connection String

### Test Locally (Optional)

You can test the connection string before deploying:

```bash
# Install psql (PostgreSQL client)
# macOS: brew install postgresql
# Linux: sudo apt-get install postgresql-client

# Test connection
psql "postgresql://postgres:password@host:5432/postgres"
```

Or use Python:

```python
import psycopg2

conn_string = "postgresql://postgres:password@host:5432/postgres"
conn = psycopg2.connect(conn_string)
print("✅ Connection successful!")
conn.close()
```

---

## 🔒 Security Best Practices

1. **Never commit connection strings to Git**
   - Use environment variables
   - Add `.env` to `.gitignore`

2. **Use connection pooling** (Supabase/Neon)
   - Better performance
   - Handles connection limits

3. **Rotate passwords regularly**
   - Change database password every 3-6 months

4. **Use SSL/TLS**
   - Neon includes SSL by default
   - Supabase supports SSL

---

## 🚨 Common Issues

### Issue 1: Connection Refused
**Solution:**
- Check if database is running (Supabase/Neon dashboard)
- Verify host and port are correct
- Check firewall settings

### Issue 2: Authentication Failed
**Solution:**
- Verify password is correct (no extra spaces)
- Make sure you replaced `[YOUR-PASSWORD]` in Supabase string
- Check username is correct

### Issue 3: SSL Required (Neon)
**Solution:**
- Make sure connection string includes `?sslmode=require`
- Neon requires SSL for all connections

### Issue 4: Special Characters in Password
**Solution:**
- URL encode special characters:
  - `@` → `%40`
  - `#` → `%23`
  - `%` → `%25`
  - `&` → `%26`
  - `+` → `%2B`
  - `=` → `%3D`

**Example:**
```
Password: MyP@ss#123
Encoded: MyP%40ss%23123
```

---

## 📝 Quick Checklist

Before deploying to Render:

- [ ] Got connection string from Supabase/Neon
- [ ] Replaced `[YOUR-PASSWORD]` (Supabase only)
- [ ] Connection string includes SSL mode (Neon)
- [ ] Tested connection (optional)
- [ ] Added to Render environment variables as `DATABASE_URL`
- [ ] Verified no special characters need encoding

---

## 🔗 Quick Links

- **Supabase:** https://supabase.com/dashboard
- **Neon:** https://console.neon.tech
- **Render:** https://dashboard.render.com

---

**Need help?** Check the main deployment guide: `RENDER_SUPABASE_DEPLOYMENT.md`

