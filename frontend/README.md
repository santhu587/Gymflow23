# Gym Management Frontend

React + Tailwind CSS frontend for Gym Management SaaS.

## Setup Instructions

### 1. Prerequisites

- Node.js 18+
- npm or yarn

### 2. Install Dependencies

```bash
cd frontend
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `frontend` directory:

```bash
cp .env.example .env
```

Edit `.env` if your backend is running on a different URL.

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
```

## Deployment

### Vercel

1. Connect your repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL` pointing to your backend API

## Features

- **Login**: JWT-based authentication
- **Dashboard**: Overview of members, revenue, and expiring memberships
- **Members**: CRUD operations with search and filtering
- **Payments**: Record payments and view outstanding dues

