# Quick Start Guide

## Prerequisites

- Python 3.9+ installed
- Node.js 18+ installed
- PostgreSQL installed and running

## Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
SECRET_KEY=your-secret-key-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=gym_management
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
EOF

# Create PostgreSQL database
# Connect to PostgreSQL and run:
# CREATE DATABASE gym_management;

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Load sample data (optional)
python manage.py load_sample_data

# Start server
python manage.py runserver
```

Backend will run on `http://localhost:8000`

## Step 2: Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## Step 3: Access the Application

1. Open browser to `http://localhost:3000`
2. Login with credentials (if you loaded sample data):
   - Username: `admin`
   - Password: `admin123`

## Testing the API

You can test the API directly using curl:

```bash
# Register a new owner
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testowner",
    "email": "test@gym.com",
    "password": "testpass123",
    "password2": "testpass123",
    "phone": "+1234567890"
  }'

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'

# Get members (replace TOKEN with access token from login)
curl -X GET http://localhost:8000/api/members/ \
  -H "Authorization: Bearer TOKEN"
```

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database `gym_management` exists

### CORS Errors
- Ensure `CORS_ALLOWED_ORIGINS` in backend `.env` includes your frontend URL
- Restart backend server after changing `.env`

### Port Already in Use
- Backend: Change port with `python manage.py runserver 8001`
- Frontend: Change port in `vite.config.js` or use `npm run dev -- --port 3001`

## Next Steps

- Review the main README.md for detailed documentation
- Set up cron job for expiry reminders (see backend/README.md)
- Deploy to production (see deployment sections in README files)

