# 🔗 How to Find Supabase Database Connection String

## Step-by-Step Instructions

### Step 1: Navigate to Project Settings

1. In your Supabase dashboard (where you are now)
2. Look at the **left sidebar** - you'll see icons
3. Click on the **⚙️ Settings** icon (gear icon) at the bottom
4. Or click **"View API settings"** button, then look for **"Database"** tab

### Step 2: Go to Database Section

1. In Settings, you'll see tabs: **General**, **API**, **Database**, **Auth**, etc.
2. Click on the **"Database"** tab

### Step 3: Find Connection String

1. Scroll down to **"Connection string"** section
2. You'll see different tabs: **URI**, **JDBC**, **Golang**, **Python**, etc.
3. Click on the **"URI"** tab
4. You'll see a connection string like:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
   OR
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### Step 4: Copy and Replace Password

⚠️ **IMPORTANT:** The connection string will have `[YOUR-PASSWORD]` placeholder

1. **Copy the connection string**
2. **Replace `[YOUR-PASSWORD]`** with your actual database password

## 🔑 Where Did You Set the Password?

The database password was set when you **created the Supabase project**:

1. When you clicked **"New Project"** in Supabase
2. You filled in:
   - Project Name
   - **Database Password** ← This is the password you need!
   - Region
3. You clicked **"Create new project"**

**If you remember the password:**
- Use that password to replace `[YOUR-PASSWORD]` in the connection string
- **Important:** Supabase shows `[YOUR-PASSWORD]` as a placeholder - you need to **manually replace it** when you copy the string
- See detailed instructions: `HOW_TO_REPLACE_PASSWORD.md`

**If you forgot the password:**
- You need to **reset it** (see below)

---

## 🔄 How to Reset Database Password

If you forgot your password, here's how to reset it:

### Step 1: Go to Database Settings
1. In Supabase dashboard
2. Click **⚙️ Settings** (gear icon) in left sidebar
3. Click **"Database"** tab

### Step 2: Reset Password
1. Scroll down to find **"Database Password"** section
2. Look for **"Reset database password"** button or link
3. Click it
4. Enter a **new password** (make it strong!)
5. Confirm the new password
6. Click **"Reset password"** or **"Save"**

### Step 3: Update Connection String
1. After resetting, go back to **"Connection string"** section
2. Copy the connection string again
3. Replace `[YOUR-PASSWORD]` with your **new password**

---

## 📍 Where to Find Password in Supabase Dashboard

**Option 1: Check Project Creation Email**
- Supabase may have sent you an email with project details
- Check your email inbox for the password

**Option 2: Reset It (Recommended)**
- Go to: Settings → Database → Reset database password
- Set a new password you'll remember
- Save it securely (password manager, notes, etc.)

**Option 3: Check Browser Password Manager**
- If you saved it during project creation
- Check your browser's saved passwords

### Example:

**What you'll see:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.dernkumctxpnlsveobzi.supabase.co:5432/postgres
```

**What you need (after replacing password):**
```
postgresql://postgres:MyActualPassword123@db.dernkumctxpnlsveobzi.supabase.co:5432/postgres
```

---

## 🎯 Quick Navigation Path

```
Supabase Dashboard
  ↓
Left Sidebar → ⚙️ Settings (gear icon)
  ↓
Click "Database" tab
  ↓
Scroll to "Connection string" section
  ↓
Click "URI" tab
  ↓
Copy connection string
  ↓
Replace [YOUR-PASSWORD] with actual password
```

---

## 🔄 Alternative: Connection Pooling (Recommended)

For better performance, use the **pooled connection**:

1. In the same **Database** section
2. Look for **"Connection Pooling"** (below Connection string)
3. Copy the **"Session"** connection string
4. It looks like:
   ```
   postgresql://postgres.dernkumctxpnlsveobzi:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

---

## 📝 What You Need for Render

Once you have the connection string (with password replaced), add it to Render:

1. Go to Render dashboard
2. Your service → **Environment** tab
3. Add variable:
   - **Key:** `DATABASE_URL`
   - **Value:** Your connection string (with password)

---

## 🆘 Can't Find It?

If you can't find the Database section:

1. Make sure you're in the **correct project** (check project name in top left)
2. Try this direct URL (replace `PROJECT-REF` with your project ref):
   ```
   https://supabase.com/dashboard/project/PROJECT-REF/settings/database
   ```
3. Your project ref from the URL: `dernkumctxpnlsveobzi`
   - So try: `https://supabase.com/dashboard/project/dernkumctxpnlsveobzi/settings/database`

---

## ✅ Checklist

- [ ] Clicked Settings (gear icon) in left sidebar
- [ ] Clicked "Database" tab
- [ ] Found "Connection string" section
- [ ] Clicked "URI" tab
- [ ] Copied connection string
- [ ] **Found or reset database password**
- [ ] Replaced `[YOUR-PASSWORD]` with actual password
- [ ] Ready to add to Render as `DATABASE_URL`

---

## 🎯 Quick Steps Summary

1. **Get connection string:**
   - Settings → Database → Connection string → URI tab
   - Copy: `postgresql://postgres:[YOUR-PASSWORD]@db.dernkumctxpnlsveobzi.supabase.co:5432/postgres`

2. **Get your password:**
   - **Remember it?** → Use that password
   - **Forgot it?** → Settings → Database → Reset database password

3. **Replace in connection string:**
   - Replace `[YOUR-PASSWORD]` with your actual password
   - Final: `postgresql://postgres:YourActualPassword@db.dernkumctxpnlsveobzi.supabase.co:5432/postgres`

4. **Add to Render:**
   - Render → Your Service → Environment → Add `DATABASE_URL`

---

**Need more help?** Check the full guide: `DATABASE_CONNECTION_GUIDE.md`

