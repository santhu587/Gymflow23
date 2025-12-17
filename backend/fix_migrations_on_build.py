#!/usr/bin/env python
"""
Script to fix migration history during build
This runs automatically during deployment
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gym_management.settings')
django.setup()

from django.db import connection
from django.core.management import call_command

def fix_migrations():
    """Fix migration history by removing problematic entries"""
    try:
        with connection.cursor() as cursor:
            # Check if django_migrations table exists
            cursor.execute("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'django_migrations'
                );
            """)
            table_exists = cursor.fetchone()[0]
            
            if table_exists:
                # Remove problematic admin migration
                cursor.execute("""
                    DELETE FROM django_migrations 
                    WHERE app = 'admin' AND name = '0001_initial';
                """)
                print("✅ Removed problematic admin migration")
            else:
                print("ℹ️  django_migrations table doesn't exist yet")
                
    except Exception as e:
        print(f"⚠️  Could not fix migrations: {e}")
        # Continue anyway - migrations will handle it

if __name__ == '__main__':
    fix_migrations()

