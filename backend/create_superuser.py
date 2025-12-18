#!/usr/bin/env python
"""
Quick script to create a superuser for Django admin
Run this in Render Shell: python create_superuser.py
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gym_management.settings')
django.setup()

from members.models import Owner

def create_superuser():
    username = 'admin'
    email = 'admin@gymflow.com'
    password = 'Admin@123'  # Change this to a secure password!
    
    if Owner.objects.filter(username=username).exists():
        print(f'❌ User "{username}" already exists!')
        print('   You can either:')
        print('   1. Use a different username')
        print('   2. Reset password: python manage.py changepassword admin')
        return False
    else:
        Owner.objects.create_superuser(
            username=username,
            email=email,
            password=password
        )
        print('✅ Superuser created successfully!')
        print(f'   Username: {username}')
        print(f'   Email: {email}')
        print(f'   Password: {password}')
        print('')
        print('🔗 Access admin panel at: https://gymflow23.onrender.com/admin/')
        print('⚠️  IMPORTANT: Change the password after first login!')
        return True

if __name__ == '__main__':
    create_superuser()

