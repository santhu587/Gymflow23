# Gym Management Backend API

Django REST Framework backend for Gym Management SaaS.

## Setup Instructions

### 1. Prerequisites

- Python 3.9+
- PostgreSQL 12+
- pip

### 2. Install Dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE gym_management;
```

### 4. Environment Configuration

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials and settings.

### 5. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 7. Load Sample Data (Optional)

```bash
python manage.py load_sample_data
```

### 8. Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new owner
- `POST /api/auth/login/` - Login and get JWT tokens

### Members
- `GET /api/members/` - List all members (with pagination, search, filters)
- `POST /api/members/` - Create new member
- `GET /api/members/{id}/` - Get member details
- `PUT /api/members/{id}/` - Update member
- `DELETE /api/members/{id}/` - Delete member
- `GET /api/members/search/?q=query&plan_type=PT&status=ACTIVE` - Search members

### Plans
- `GET /api/plans/` - List all plans

### Payments
- `GET /api/payments/` - List all payments
- `POST /api/payments/` - Create new payment
- `GET /api/payments/member_payments/?member_id={id}` - Get payments for a member
- `GET /api/payments/outstanding_dues/?member_id={id}` - Get outstanding dues for a member

### Dashboard
- `GET /api/dashboard/stats/` - Get dashboard statistics

## Cron Job Setup

To run the daily expiry reminder job, add to your crontab:

```bash
0 9 * * * cd /path/to/backend && /path/to/venv/bin/python manage.py send_expiry_reminders
```

Or use a task scheduler on your deployment platform.

## Deployment

### Render/Railway

1. Set environment variables in your platform dashboard
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `python manage.py migrate && python manage.py runserver 0.0.0.0:$PORT`
4. Ensure PostgreSQL addon is configured

