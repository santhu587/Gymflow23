# Gymflow23 - Gym Management System

A modern, full-stack gym management SaaS application built with Django REST Framework and React.

## Features

- 🔐 **Authentication**: Secure JWT-based authentication
- 👥 **Member Management**: Complete CRUD operations for gym members
- 💰 **Payment Tracking**: Record and track member payments
- 🏋️ **Trainer Management**: Manage trainers and their payments
- 📊 **Dashboard**: Real-time analytics and insights
- 🏢 **Gym Profile**: Customize your gym information
- 📱 **Responsive Design**: Beautiful Apple-inspired UI

## Tech Stack

### Backend
- Django 4.2
- Django REST Framework
- PostgreSQL (Production) / SQLite (Development)
- JWT Authentication
- CORS enabled

### Frontend
- React 18
- Vite
- Tailwind CSS
- GSAP Animations
- Axios

## Quick Start

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Deployment

### Backend to production (complete guide)
**[BACKEND_PRODUCTION_DEPLOYMENT.md](./BACKEND_PRODUCTION_DEPLOYMENT.md)** — Step-by-step guide to deploy the backend on Render with PostgreSQL (Supabase or Neon): database setup, env vars, build/start commands, admin user, and troubleshooting.

### Option 1: Render + Supabase/Neon (Recommended)
See [RENDER_SUPABASE_DEPLOYMENT.md](./RENDER_SUPABASE_DEPLOYMENT.md) for more deployment details:
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** Supabase PostgreSQL or Neon PostgreSQL

### Option 2: Railway
See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for detailed deployment instructions:
- **Frontend:** Vercel
- **Backend:** Railway
- **Database:** Railway PostgreSQL

## Project Structure

```
GyTech/
├── backend/          # Django backend
│   ├── members/      # Members app
│   ├── plans/        # Plans app
│   ├── payments/     # Payments app
│   └── dashboard/    # Dashboard app
├── frontend/         # React frontend
│   ├── src/
│   │   ├── pages/    # Page components
│   │   ├── components/ # Reusable components
│   │   └── services/ # API services
└── README.md
```

## License

Copyright © 2025 GymFlow. All rights reserved.

**Design and Developed by Santhosh Chandra**
