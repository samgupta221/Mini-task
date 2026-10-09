# Mini Task Board

A small full-stack task board. You can add tasks, move them between **To do**, **In progress** and **Done**, and delete them.

**Stack:** Next.js 14 (App Router) · TypeScript · React · MySQL (`mysql2`)

## Run it locally

You need Node.js 18+ and a running MySQL (or MariaDB) server.

```bash
# 1. Install dependencies
npm install

# 2. Configure the database connection
cp .env.example .env.local
#    then edit .env.local with your MySQL user and password

# 3. Create the database, the tasks table, and sample rows
npm run db:seed

# 4. Start the app
npm run dev
```

Open http://localhost:3000.

Other commands:

| Command | What it does |
| --- | --- |
| `npm run db:migrate` | Creates the database and table only (no sample data) |
| `npm run db:seed` | Same as above, plus sample tasks if the table is empty |
| `npm run typecheck` | Runs the TypeScript compiler without emitting files |
| `npm run build && npm start` | Production build and server |

If you prefer plain SQL, `db/schema.sql` and `db/seed.sql` can be run directly in any MySQL client.

## Backend choice: Next.js API routes

I used Next.js route handlers instead of a separate Express server. For an app this small, one project means one install, one dev command, and one deployment. The API and the UI also import the same TypeScript types directly, so there is no duplicate type package to keep in sync. If the API ever needs to serve other clients or scale separately, `src/lib/tasks-repo.ts` has no Next.js code in it and could move into an Express app unchanged.

## Project layout

```
db/
  schema.sql            tasks table
  seed.sql              sample rows
scripts/
  migrate.mjs           applies schema.sql (and seed.sql with --seed)
src/
  app/
    api/tasks/          GET list, POST create
    api/tasks/[id]/     PATCH status, DELETE
    page.tsx            the single page
  components/           TaskBoard, TaskForm, TaskItem
  lib/
    db.ts               MySQL connection pool
    tasks-repo.ts       all SQL lives here
    validation.ts       request parsing for the API
    task-rules.ts       pure rules (title, status) shared with the UI
    api-client.ts       typed fetch helpers used by the UI
    errors.ts           HttpError and error-to-response helper
  types/task.ts         types shared by API and UI
```

## API

| Method | Path | Body | Success |
| --- | --- | --- | --- |
| GET | `/api/tasks` | – | `200` list of tasks |
| POST | `/api/tasks` | `{ "title": string, "status"?: Status }` | `201` created task |
| PATCH | `/api/tasks/:id` | `{ "status": Status }` | `200` updated task |
| DELETE | `/api/tasks/:id` | – | `204` |

`Status` is `"todo" | "in-progress" | "done"`. Errors come back as `{ "error": "message" }` with `400` (bad input), `404` (unknown id) or `500` (unexpected; details are only logged on the server).

## Notes on the implementation

- **SQL safety:** every query uses `?` placeholders through `pool.execute`. User input is never joined into a SQL string.
- **Validation:** titles are trimmed, must not be empty, and are limited to 200 characters. The same rule runs in the form (for instant feedback) and in the API (the real check).
- **Shared types:** `src/types/task.ts` is used by the route handlers, the repository, the API client and the components. Request bodies arrive as `unknown` and are narrowed in `validation.ts`, so there is no `any` in the codebase.
- **UI states:** the board shows a loading state, a load error with a retry button, an empty state, and a dismissible banner for failed actions.
- **Optimistic updates:** changing a status updates the UI immediately and rolls back with an error message if the request fails. New tasks and deletes wait for the server.
- **Accessibility:** form fields have labels, errors use `role="alert"`, and every status select has a hidden label naming its task.

## What I would add with more time

- Automated tests for `validation.ts` and the API routes
- Moving tasks by drag and drop
- Editing a task's title
- A proper migrations tool once there is more than one table
