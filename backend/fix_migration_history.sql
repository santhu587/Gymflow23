-- SQL script to fix migration history without losing data
-- Run this in your PostgreSQL database Shell on Render

-- Step 1: Check current migration state
SELECT app, name FROM django_migrations ORDER BY app, name;

-- Step 2: Remove problematic migration entries
-- This removes the admin migration that's causing the conflict
DELETE FROM django_migrations WHERE app = 'admin' AND name = '0001_initial';

-- Step 3: If needed, remove all migration records (they'll be recreated with --fake-initial)
-- Uncomment the line below if Step 2 doesn't work:
-- DELETE FROM django_migrations;

-- Step 4: Verify
SELECT COUNT(*) FROM django_migrations;

