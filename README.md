# Mini Task Board

A simple, responsive, and full-stack task management application built with **Next.js, React, TypeScript, and MySQL**. The application allows users to create tasks, organize them into different workflow stages, track progress, and delete tasks through an intuitive Kanban-style interface.

## Live Demo

**[View Mini Task Board](https://willowy-tarsier-7535d1.netlify.app/)**

## Project Preview

Mini Task Board provides a clean and organized workspace with three task management columns:

- **To Do:** Tasks waiting to be started.
- **In Progress:** Tasks currently being worked on.
- **Done:** Tasks that have been completed.

Users can add new tasks, choose their initial status, move tasks between columns, and delete tasks when they are no longer required.

## Features

- **Create Tasks:** Add new tasks using a simple input form.
- **Task Management:** Organize tasks into three different workflow stages.
- **Status Updates:** Move tasks between To Do, In Progress, and Done.
- **Delete Tasks:** Remove unwanted tasks.
- **MySQL Database:** Store and manage tasks using a relational database.
- **REST API:** Perform CRUD operations through Next.js API routes.
- **Input Validation:** Prevent empty task titles and restrict titles to 200 characters.
- **Optimistic UI Updates:** Provide immediate feedback when updating task statuses.
- **Error Handling:** Display meaningful error messages and retry options.
- **Responsive Design:** Access the task board across different screen sizes.
- **TypeScript:** Maintain type safety and improve code reliability.

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 | Full-stack React framework |
| React 18 | Frontend user interface |
| TypeScript | Type safety |
| MySQL | Relational database |
| mysql2 | MySQL connectivity |
| Node.js | Backend runtime |
| CSS | Styling and responsive design |
| REST API | Backend communication |
| Netlify | Application deployment |

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Generate a production build |
| `npm start` | Start the production server |
| `npm run typecheck` | Check TypeScript types |
| `npm run db:migrate` | Create database tables |
| `npm run db:seed` | Initialize the database with sample tasks |

## API Documentation

The application uses Next.js Route Handlers to manage task operations.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Retrieve all tasks |
| POST | `/api/tasks` | Create a new task |
| PATCH | `/api/tasks/:id` | Update task status |
| DELETE | `/api/tasks/:id` | Delete a task |

### Create a Task

**POST** `/api/tasks`

Request Body:

```json
{
  "title": "Complete project documentation",
  "status": "todo"
}
```

### Update Task Status

**PATCH** `/api/tasks/:id`

Request Body:

```json
{
  "status": "done"
}
```

### Delete a Task

**DELETE** `/api/tasks/:id`

Deletes the specified task from the database.

### Supported Task Statuses

- `todo`
- `in-progress`
- `done`

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
├── next.config.mjs
└── README.md
```

## How It Works

1. Users enter a task title and select its initial status.
2. The frontend validates the input.
3. The application sends a request to the Next.js API.
4. The backend validates the request and communicates with MySQL.
5. Tasks are retrieved and displayed in their respective columns.
6. Users can update task statuses or delete tasks.
7. The interface displays loading indicators, success states, and error messages.

## Validation and Error Handling

The application implements validation and error-handling mechanisms to ensure reliable task management.

- Task titles cannot be empty.
- Leading and trailing whitespace is removed.
- Task titles are limited to 200 characters.
- Only supported task statuses are accepted.
- Invalid requests return HTTP 400.
- Nonexistent task IDs return HTTP 404.
- Unexpected server errors return HTTP 500.
- Parameterized SQL queries help protect against SQL injection.

**Live Application:**  
https://willowy-tarsier-7535d1.netlify.app/



