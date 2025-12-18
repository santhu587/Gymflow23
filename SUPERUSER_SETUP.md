# 👤 Superuser Setup - Access Admin Panel

## 🎯 Goal: Access Django Admin to View Registered Users

You need to create a superuser account to access the Django admin panel where you can see all registered users.

---

## ✅ Method 1: Create Superuser via Render Shell (Recommended)

### Step 1: Access Render Shell

1. Go to **Render Dashboard**: https://dashboard.render.com
2. Select your **backend service**
3. Click **"Shell"** tab (or look for "Open Shell" button)
4. This opens a terminal connected to your Render service

### Step 2: Create Superuser

In the Render Shell, run:

```bash
cd backend
python manage.py createsuperuser
```

### Step 3: Enter Details

You'll be prompted to enter:
- **Username:** (choose a username, e.g., `admin`)
- **Email:** (your email address)
- **Password:** (create a strong password)
- **Password (again):** (confirm password)

**Example:**
```
Username: admin
Email: your-email@example.com
Password: ********
Password (again): ********
```

### Step 4: Access Admin Panel

1. Go to: `https://gymflow23.onrender.com/admin/`
2. Login with your superuser credentials
3. You'll see the Django admin dashboard

---

## ✅ Method 2: Create Superuser via Management Command (Alternative)

If you have access to run commands, you can create a superuser via a management command.

### Step 1: Create Management Command

Create file: `backend/members/management/commands/create_superuser.py`

```python
from django.core.management.base import BaseCommand
from members.models import Owner

class Command(BaseCommand):
    help = 'Create a superuser'

    def handle(self, *args, **options):
        username = 'admin'  # Change this
        email = 'admin@example.com'  # Change this
        password = 'your-secure-password'  # Change this
        
        if Owner.objects.filter(username=username).exists():
            self.stdout.write(self.style.WARNING(f'User {username} already exists'))
        else:
            Owner.objects.create_superuser(username=username, email=email, password=password)
            self.stdout.write(self.style.SUCCESS(f'Superuser {username} created successfully'))
```

### Step 2: Run Command

In Render Shell:
```bash
cd backend
python manage.py create_superuser
```

---

## ✅ Method 3: Create Superuser via Python Script

### Step 1: Create Script

Create file: `backend/create_admin.py`

```python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gym_management.settings')
django.setup()

from members.models import Owner

# Create superuser
username = 'admin'
email = 'admin@example.com'
password = 'your-secure-password'

if not Owner.objects.filter(username=username).exists():
    Owner.objects.create_superuser(username=username, email=email, password=password)
    print(f'Superuser {username} created successfully')
else:
    print(f'User {username} already exists')
```

### Step 2: Run Script

In Render Shell:
```bash
cd backend
python create_admin.py
```

---

## 🔍 Access Admin Panel

### Step 1: Go to Admin URL

```
https://gymflow23.onrender.com/admin/
```

### Step 2: Login

- **Username:** (the username you created)
- **Password:** (the password you set)

### Step 3: View Users

1. In admin panel, click **"Owners"** (or "Users")
2. You'll see all registered users
3. You can:
   - View user details
   - See registration dates
   - Filter and search users
   - Edit user information

---

## 📊 View User Statistics

### In Admin Panel:

1. **Total Users:**
   - Go to **"Owners"** section
   - See total count at the top

2. **User Details:**
   - Click on any user to see:
     - Username
     - Email
     - Phone
     - Registration date
     - Active status
     - Superuser status

3. **Filter Users:**
   - Filter by: Active, Superuser, Date joined
   - Search by username or email

---

## 🎯 Quick Setup (Easiest Method)

**In Render Shell:**

```bash
cd backend
python manage.py createsuperuser
```

Enter:
- Username: `admin`
- Email: `your-email@example.com`
- Password: `your-secure-password`

Then access: `https://gymflow23.onrender.com/admin/`

---

## 🆘 Troubleshooting

### Issue 1: Can't Access Render Shell
**Solution:**
- Check if your Render plan supports shell access
- Free tier should have shell access
- Try refreshing the page

### Issue 2: "Command not found"
**Solution:**
- Make sure you're in the `backend` directory
- Check if `manage.py` exists: `ls manage.py`

### Issue 3: "User already exists"
**Solution:**
- The username is already taken
- Choose a different username
- Or reset the password: `python manage.py changepassword username`

### Issue 4: Can't Login to Admin
**Solution:**
- Verify username and password are correct
- Check if user is superuser: In shell, run:
  ```python
  python manage.py shell
  from members.models import Owner
  user = Owner.objects.get(username='admin')
  user.is_superuser  # Should be True
  user.is_staff  # Should be True
  ```

---

## 📝 Admin Panel Features

Once logged in, you can:

1. **View All Users:**
   - See total registered users
   - View user details
   - Filter and search

2. **Manage Users:**
   - Edit user information
   - Activate/deactivate users
   - Make users superusers

3. **View Other Data:**
   - Members
   - Trainers
   - Payments
   - Plans
   - Gym profiles

---

## ✅ Checklist

- [ ] Access Render Shell
- [ ] Run `python manage.py createsuperuser`
- [ ] Enter username, email, password
- [ ] Access `https://gymflow23.onrender.com/admin/`
- [ ] Login with superuser credentials
- [ ] View registered users in "Owners" section

---

**After creating superuser, you can access the admin panel and see all registered users!**

