#!/bin/bash

echo "🚀 GymFlow Backend - Quick Start with MySQL"
echo ""

# Check MySQL
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL not found. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install mysql
        brew services start mysql
    else
        echo "Please install MySQL manually: https://dev.mysql.com/downloads/mysql/"
        exit 1
    fi
fi

# Create database
echo "📦 Creating MySQL database..."
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS gym_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null || {
    echo "⚠️  Could not create database automatically."
    echo "Please run manually:"
    echo "  mysql -u root -p"
    echo "  CREATE DATABASE gym_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
}

# Setup virtual environment
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -q -r requirements.txt

# Create .env if not exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your MySQL password!"
    echo "   Set DB_PASSWORD=your_mysql_password"
    read -p "Press Enter after editing .env file..."
fi

# Run migrations
echo "🗄️  Running migrations..."
python manage.py migrate

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the server:"
echo "  source venv/bin/activate"
echo "  python manage.py runserver"
echo ""
echo "To create superuser:"
echo "  python manage.py createsuperuser"
