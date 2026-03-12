# Task Manager App

A full-stack task management web app built with React, Express, and PostgreSQL.

## Features

- Create, edit, and delete tasks
- Filter tasks by status: `todo`, `in-progress`, `done`
- Responsive UI with Tailwind CSS

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18, Vite, Tailwind CSS, Axios |
| Backend  | Node.js, Express 4                  |
| Database | PostgreSQL                          |
| ORM      | pg (node-postgres) with raw SQL     |

## Project Structure

```
task-manager-app/
├── backend/
│   ├── src/
│   │   ├── index.js                 # Express entry point
│   │   ├── db.js                    # PostgreSQL connection pool
│   │   ├── routes/
│   │   │   └── tasks.js             # /api/tasks routes
│   │   ├── controllers/
│   │   │   └── tasksController.js   # CRUD logic
│   │   └── middleware/
│   │       └── errorHandler.js
│   └── db/
│       └── schema.sql               # Table definitions
└── frontend/
    └── src/
        ├── App.jsx
        ├── api/tasks.js             # Axios API calls
        ├── hooks/useTasks.js        # Data fetching + state
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

```bash
cp backend/.env.example backend/.env
```

```env
DATABASE_URL=postgresql://localhost:5432/taskmanager
PORT=3001
```

### 4. Start the servers

```bash
# Backend (port 3001)
cd backend && npm run dev

# Frontend (port 5173) — in a separate terminal
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## API Endpoints

| Method | Path               | Description        |
|--------|--------------------|--------------------|
| GET    | /api/tasks         | List all tasks     |
| GET    | /api/tasks?status= | Filter by status   |
| GET    | /api/tasks/:id     | Get single task    |
| POST   | /api/tasks         | Create task        |
| PUT    | /api/tasks/:id     | Update task        |
| DELETE | /api/tasks/:id     | Delete task        |

## Database Schema

```sql
CREATE TABLE tasks (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  status      VARCHAR(20)  NOT NULL DEFAULT 'todo'
                CHECK (status IN ('todo', 'in-progress', 'done')),
  due_date    DATE,
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
  "created_at": "2026-03-11T10:00:00Z",
  "updated_at": "2026-03-11T10:00:00Z"
}
```
