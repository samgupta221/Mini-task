# Mini Task Board

A simple and responsive task management application built with Next.js, React, TypeScript, and MySQL. It allows users to create tasks, organize them by status, track progress, and delete tasks through a clean, Kanban-style interface.

## Project Preview

The Mini Task Board provides three task columns:

- **To do** — Tasks waiting to be started.
- **In progress** — Tasks currently being worked on.
- **Done** — Tasks that have been completed.

Users can add new tasks, select their initial status, update task statuses, and delete tasks as needed.

## Features

- **Create Tasks:** Add tasks with a simple input form.
- **Task Status Management:** Move tasks between To do, In progress, and Done.
- **Delete Tasks:** Remove tasks that are no longer needed.
- **MySQL Database:** Persist tasks in a relational database.
- **REST API:** Manage tasks through API endpoints.
- **Input Validation:** Prevent empty task titles and titles longer than 200 characters.
- **Optimistic UI Updates:** Update task status immediately while the server request completes.
- **Error Handling:** Display feedback for failed operations and allow users to retry loading tasks.
- **Responsive Interface:** Clean layout designed for convenient task management.
- **TypeScript:** Improve code reliability with type-safe components and API requests.

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 | Full-stack React framework |
| React 18 | User interface |
| TypeScript | Type safety |
| MySQL | Relational database |
| mysql2 | MySQL database connectivity |
| CSS | Styling and responsive layout |
| REST API | Task creation and management |
| Node.js | JavaScript runtime |

## Getting Started

Follow these instructions to run the project locally.

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate to the project directory:

```bash
cd Task
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure the Database

Create a MySQL database named `task_board` if it does not already exist.

Create a `.env.local` file in the project root and configure your database credentials:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=task_board
```

Replace `your_mysql_password` with your actual MySQL password.

**Important:** Keep your `.env.local` file private. Never commit database credentials or other secrets to GitHub.

### 4. Initialize the Database

To create the required database tables without sample tasks, run:

```bash
npm run db:migrate
```

To initialize the database and insert sample tasks when the table is empty, run:

```bash
npm run db:seed
```

### 5. Start the Development Server

```bash
npm run dev
```

Open the application in your browser:

http://localhost:3000

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Creates a production build |
| `npm start` | Runs the production server |
| `npm run typecheck` | Checks TypeScript types |
| `npm run db:migrate` | Creates the database schema |
| `npm run db:seed` | Initializes the schema and sample tasks |

## API Endpoints

The application uses Next.js Route Handlers to provide API functionality.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Fetch all tasks |
| POST | `/api/tasks` | Create a new task |
| PATCH | `/api/tasks/:id` | Update a task's status |
| DELETE | `/api/tasks/:id` | Delete a task |

### Create a Task

**Endpoint:** `POST /api/tasks`

Example request body:

```json
{
  "title": "Complete project documentation",
  "status": "todo"
}
```

Supported task statuses:

- `todo`
- `in-progress`
- `done`

### Update Task Status

**Endpoint:** `PATCH /api/tasks/:id`

Example request body:

```json
{
  "status": "done"
}
```

### Delete a Task

**Endpoint:** `DELETE /api/tasks/:id`

The task is removed from the database when the request succeeds.

## Project Structure

```text
Task/
├── db/
│   ├── schema.sql
│   └── seed.sql
├── scripts/
│   └── migrate.mjs
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── tasks/
│   │   │       ├── route.ts
│   │   │       └── [id]/
│   │   │           └── route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── TaskBoard.tsx
│   │   ├── TaskForm.tsx
│   │   └── TaskItem.tsx
│   ├── lib/
│   │   ├── api-client.ts
│   │   ├── db.ts
│   │   ├── errors.ts
│   │   ├── task-rules.ts
│   │   ├── tasks-repo.ts
│   │   └── validation.ts
│   └── types/
│       └── task.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

## How It Works

1. The user enters a task title and selects its starting status.
2. The frontend validates the task title.
3. The application sends a request to the Next.js API.
4. The backend validates the incoming data and interacts with MySQL.
5. The task board displays tasks under their respective statuses.
6. Users can change a task's status or delete it.
7. The interface handles loading states and displays errors when an operation fails.

## Validation and Error Handling

The application includes validation and error-handling mechanisms to improve reliability.

- Task titles cannot be empty.
- Leading and trailing whitespace is removed from task titles.
- Task titles are limited to 200 characters.
- Only supported task statuses are accepted.
- Invalid requests return a `400` response.
- Requests for nonexistent task IDs return a `404` response.
- Unexpected server errors return a `500` response.

Database queries use parameterized statements to help prevent SQL injection.


