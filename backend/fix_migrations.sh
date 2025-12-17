#!/bin/bash
# Script to fix migration history issues

echo "Fixing migration history..."

# First, try to fake initial migrations
python manage.py migrate --fake-initial

# Then run normal migrations
python manage.py migrate

echo "Migration fix complete!"

