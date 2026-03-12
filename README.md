# Task Manager App

A full-stack task management web app with Google OAuth authentication, built with React, Express, and PostgreSQL.

## Features

- Google OAuth 2.0 login (no passwords)
- Create, edit, delete tasks
- Filter tasks by status: `todo`, `in-progress`, `done`
- Drag and drop task reordering
- Per-user task isolation — each user only sees their own tasks
- Responsive UI with Tailwind CSS

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 18, Vite, Tailwind CSS, Axios     |
| Backend  | Node.js, Express 4                      |
| Database | PostgreSQL                              |
| Auth     | Google OAuth 2.0, Passport.js, JWT      |

## Project Structure

```
task-manager-app/
├── backend/
│   ├── src/
│   │   ├── index.js                 # Express entry point
│   │   ├── db.js                    # PostgreSQL connection pool
│   │   ├── auth/
│   │   │   └── passport.js          # Google OAuth strategy
│   │   ├── routes/
│   │   │   ├── tasks.js             # /api/tasks routes
│   │   │   └── auth.js              # /auth routes
│   │   ├── controllers/
│   │   │   └── tasksController.js   # CRUD logic
│   │   └── middleware/
│   │       ├── requireAuth.js       # JWT verification
│   │       └── errorHandler.js
│   └── db/
│       └── schema.sql               # Table definitions
└── frontend/
    └── src/
        ├── App.jsx
        ├── api/tasks.js             # Axios API calls
        ├── hooks/useTasks.js        # Data fetching + state
        ├── context/AuthContext.jsx  # Auth state
        ├── pages/LoginPage.jsx
        └── components/
            ├── TaskList.jsx
            ├── TaskCard.jsx
            ├── TaskForm.jsx
            ├── TaskFilter.jsx
            └── Modal.jsx
```

## Prerequisites

- Node.js 18+
- PostgreSQL 14+

## Setup

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd task-manager-app

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Set up PostgreSQL

```bash
createdb taskmanager
psql -d taskmanager -f backend/db/schema.sql
```

### 3. Configure environment variables

Copy the example file and fill in your values:

```bash
cp backend/.env.example backend/.env
```

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/taskmanager
PORT=3001
NODE_ENV=development

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
JWT_SECRET=a-long-random-secret-string

BACKEND_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173
```

### 4. Set up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project → **APIs & Services** → **Credentials**
3. Create an **OAuth 2.0 Client ID** (Web application)
4. Add authorized redirect URI: `http://localhost:3001/auth/google/callback`
5. Copy the **Client ID** and **Client Secret** into `backend/.env`

### 5. Start the servers

```bash
# Backend (port 3001)
cd backend && npm run dev

# Frontend (port 5173) — in a separate terminal
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## API Endpoints

All `/api/tasks` routes require a `Authorization: Bearer <token>` header.

| Method | Path             | Description         |
|--------|------------------|---------------------|
| GET    | /auth/google     | Initiate Google login |
| GET    | /auth/me         | Get current user    |
| POST   | /auth/logout     | Logout              |
| GET    | /api/tasks       | List all tasks      |
| GET    | /api/tasks?status= | Filter by status  |
| GET    | /api/tasks/:id   | Get single task     |
| POST   | /api/tasks       | Create task         |
| PUT    | /api/tasks/:id   | Update task         |
| DELETE | /api/tasks/:id   | Delete task         |
| GET    | /health          | Health check        |

## Database Schema

```sql
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  google_id  TEXT UNIQUE NOT NULL,
  email      TEXT NOT NULL,
  name       TEXT NOT NULL,
  avatar     TEXT
);

CREATE TABLE tasks (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  status      VARCHAR(20)  NOT NULL DEFAULT 'todo'
                CHECK (status IN ('todo', 'in-progress', 'done')),
  due_date    DATE,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
```

## Task Object

```json
{
  "id": 1,
  "title": "Build the API",
  "description": "Set up Express routes",
  "status": "in-progress",
  "due_date": "2026-03-20",
  "user_id": 1,
  "created_at": "2026-03-11T10:00:00Z",
  "updated_at": "2026-03-11T10:00:00Z"
}
```

## Auth Flow

1. User clicks **Sign in with Google** → redirected to `/auth/google`
2. Google redirects back to `/auth/google/callback`
3. Backend upserts the user in the database and issues a JWT (7-day expiry)
4. Frontend stores the token in `localStorage` and attaches it to all API requests
5. On logout the token is removed from `localStorage`
