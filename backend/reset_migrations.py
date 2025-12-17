#!/usr/bin/env python
"""
Script to reset migration history in database
Run this via Render Shell if migrations are corrupted
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gym_management.settings')
django.setup()

from django.db import connection

def reset_migration_history():
    """Reset django_migrations table to fix inconsistent history"""
    with connection.cursor() as cursor:
        # Delete all migration records
        cursor.execute("DELETE FROM django_migrations;")
        print("✅ Cleared migration history")
        
        # Now fake all initial migrations
        from django.core.management import call_command
        call_command('migrate', '--fake-initial', verbosity=2)
        print("✅ Faked initial migrations")
        
        # Run remaining migrations
        call_command('migrate', verbosity=2)
        print("✅ Applied remaining migrations")

if __name__ == '__main__':
    reset_migration_history()

