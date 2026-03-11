# Task Manager App — CLAUDE.md

## Project Overview
Full-stack Task Manager web app with React frontend, Node.js/Express backend, and PostgreSQL database.

## Tech Stack
| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS      |
| Backend    | Node.js, Express 4                |
| Database   | PostgreSQL                        |
| ORM        | pg (node-postgres) with raw SQL   |
| API Style  | REST                              |

## Folder Structure
```
task-manager-app/
├── CLAUDE.md
├── backend/
│   ├── package.json
│   ├── .env                    # DB credentials (never commit)
│   ├── .env.example
│   ├── src/
│   │   ├── index.js            # Express app entry point
│   │   ├── db.js               # PostgreSQL connection pool
│   │   ├── routes/
│   │   │   └── tasks.js        # /api/tasks routes
│   │   ├── controllers/
│   │   │   └── tasksController.js
│   │   └── middleware/
│   │       └── errorHandler.js
│   └── db/
│       └── schema.sql          # Table definitions
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api/
        │   └── tasks.js        # Axios API calls
        ├── components/
        │   ├── TaskList.jsx
        │   ├── TaskCard.jsx
        │   ├── TaskForm.jsx
        │   ├── TaskFilter.jsx
        │   └── Modal.jsx
        └── hooks/
            └── useTasks.js     # Data fetching + state logic
```

## REST API Endpoints
| Method | Path              | Description         |
|--------|-------------------|---------------------|
| GET    | /api/tasks        | List all tasks      |
| GET    | /api/tasks?status=| Filter by status    |
| GET    | /api/tasks/:id    | Get single task     |
| POST   | /api/tasks        | Create task         |
| PUT    | /api/tasks/:id    | Update task         |
| DELETE | /api/tasks/:id    | Delete task         |

## Task Schema
```sql
CREATE TABLE tasks (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  status      VARCHAR(20) NOT NULL DEFAULT 'todo'
                CHECK (status IN ('todo', 'in-progress', 'done')),
  due_date    DATE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Task Object (JSON)
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

## Dev Setup
```bash
# 1. Start PostgreSQL and create database
createdb taskmanager

# 2. Run schema
psql -d taskmanager -f backend/db/schema.sql

# 3. Backend
cd backend && npm install && npm run dev   # port 3001

# 4. Frontend
cd frontend && npm install && npm run dev  # port 5173
```

## Environment Variables (backend/.env)
```
DATABASE_URL=postgresql://localhost:5432/taskmanager
PORT=3001
```

## Key Conventions
- Backend runs on port **3001**, frontend on **5173**
- Frontend proxies `/api/*` to `http://localhost:3001` via Vite config
- All API responses return JSON with shape `{ data }` or `{ error }`
- Status values are strictly: `todo` | `in-progress` | `done`
- Dates stored as `DATE` (no time component), returned as ISO string `YYYY-MM-DD`
- Use raw SQL via `pg` pool — no ORM
- Tailwind utility classes only — no custom CSS files
- Component files use `.jsx`, utility/api files use `.js`

## Implementation Order
1. `backend/db/schema.sql` — define table
2. `backend/src/db.js` — pg pool
3. `backend/src/controllers/tasksController.js` — CRUD logic
4. `backend/src/routes/tasks.js` — wire routes
5. `backend/src/index.js` — Express app
6. `frontend/src/api/tasks.js` — axios wrappers
7. `frontend/src/hooks/useTasks.js` — state + fetch hook
8. `frontend/src/components/` — UI components
9. `frontend/src/App.jsx` — compose UI
