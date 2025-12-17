# How to Add PostgreSQL Database in Render

## Step-by-Step Guide

### Step 1: Create PostgreSQL Database First

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. **Click the "New +" button** at the top right
3. **Select "PostgreSQL"** from the dropdown menu
   - ⚠️ **Important:** Select "PostgreSQL", NOT "Web Service"
   - It should be in the list of services you can create

4. **Configure the Database:**
   - **Name:** `gymflow-db` (or any name you prefer)
   - **Database:** `gymflow`
   - **User:** `gymflow_user` (or leave default)
   - **Region:** Choose the region closest to you
   - **PostgreSQL Version:** Latest (14 or 15)
   - **Plan:** 
     - **Free** - For testing (spins down after inactivity)
     - **Starter** ($7/month) - For production (always on)

5. **Click "Create Database"**
6. **Wait for provisioning** (takes 1-2 minutes)
7. **Once ready**, you'll see the database dashboard

### Step 2: Get Database Connection URL

1. **In the database dashboard**, look for:
   - **"Internal Database URL"** - Use this one (recommended)
   - **"External Database URL"** - Only if needed
   
2. **Copy the Internal Database URL**
   - It looks like: `postgresql://user:password@hostname:5432/dbname`
   - Keep this secure!

### Step 3: Link Database to Your Web Service

1. **Go to your Web Service dashboard** (the backend you created)
2. **Click the "Environment" tab**
3. **Scroll down** to "Environment Variables" section
4. **Click "+ Add Environment Variable"**
5. **Add:**
   - **Key:** `DATABASE_URL`
   - **Value:** Paste the Internal Database URL you copied
6. **Click "Save Changes"**
7. **Render will automatically redeploy** your service with the new database

### Alternative: Link Database via Render Dashboard

Some Render interfaces have a "Link Database" button:
1. In your Web Service dashboard
2. Look for "Databases" section
3. Click "Link Database" or "Connect Database"
4. Select your `gymflow-db` database
5. Render will automatically add `DATABASE_URL` environment variable

## Troubleshooting

### Can't find PostgreSQL option?
- Make sure you're clicking "New +" at the top of the dashboard
- Look for "PostgreSQL" in the service types list
- If you don't see it, try refreshing the page
- Make sure you're logged into Render

### Database URL not working?
- Make sure you're using the **Internal Database URL** (not External)
- Check that the database status is "Available"
- Verify the URL format: `postgresql://user:pass@host:port/dbname`

### Service can't connect to database?
- Ensure `DATABASE_URL` is set correctly in environment variables
- Check that both services are in the same region
- Verify the database is "Available" (not "Paused")

## Quick Checklist

- [ ] Created PostgreSQL database in Render
- [ ] Copied Internal Database URL
- [ ] Added DATABASE_URL to Web Service environment variables
- [ ] Service redeployed successfully
- [ ] Database connection working

---

**Need help?** Check Render documentation: https://render.com/docs/databases
