#!/bin/bash

echo "🚀 Starting GymFlow Backend Locally with MySQL..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ Please edit .env file with your MySQL credentials"
    echo "   Set USE_MYSQL=True and your DB credentials"
    exit 1
fi

# Activate virtual environment
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Run migrations
echo "🗄️  Running database migrations..."
python manage.py migrate

# Create superuser if needed
echo ""
read -p "Create superuser? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    python manage.py createsuperuser
fi

# Run server
echo "🌟 Starting development server..."
python manage.py runserver
