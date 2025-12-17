# How to Add DATABASE_URL to Render Web Service

## Step-by-Step Instructions

### After Creating PostgreSQL Database:

1. **Copy the Internal Database URL:**
   - Go to your PostgreSQL database dashboard
   - Find "Internal Database URL" section
   - Click "Copy" or manually copy the URL
   - It looks like: `postgresql://user:password@hostname:5432/dbname`

### Add to Web Service:

2. **Go to Your Web Service Dashboard:**
   - In Render Dashboard, click on your web service (e.g., `gymflow-backend`)

3. **Open Environment Tab:**
   - Click on **"Environment"** tab (in the top menu)
   - You'll see a list of environment variables

4. **Add DATABASE_URL:**
   - Click **"+ Add Environment Variable"** button
   - In the popup/form:
     - **Key:** Type `DATABASE_URL` (exactly like this, all caps)
     - **Value:** Paste the Internal Database URL you copied
   - Click **"Save Changes"** or **"Add"**

5. **Service Will Redeploy:**
   - Render will automatically detect the change
   - Your service will redeploy with the new database connection
   - Wait for deployment to complete (2-3 minutes)

### Verify It's Working:

6. **Check Logs:**
   - Go to "Logs" tab in your web service
   - Look for successful database connection messages
   - Should see: "Operations to perform: Apply all migrations"

## Visual Guide:

```
Render Dashboard
  └── Your Web Service (gymflow-backend)
      └── Click "Environment" tab
          └── Click "+ Add Environment Variable"
              └── Key: DATABASE_URL
              └── Value: postgresql://user:pass@host:5432/dbname
              └── Save
```

## Alternative Method (If Available):

Some Render interfaces have a "Link Database" feature:
1. In your Web Service dashboard
2. Look for "Databases" section
3. Click "Link Database" or "Connect Database"
4. Select your PostgreSQL database
5. Render automatically adds DATABASE_URL

## Troubleshooting:

**Can't find Environment tab?**
- Make sure you're in the Web Service dashboard (not database dashboard)
- Look for tabs: Overview, Environment, Logs, Settings

**DATABASE_URL not saving?**
- Make sure there are no extra spaces
- Key must be exactly: `DATABASE_URL`
- Value must be the full URL starting with `postgresql://`

**Service still can't connect?**
- Verify database status is "Available" (not "Paused")
- Check that both services are in the same region
- Review logs for specific error messages
