import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "@/lib/db";
import type { CreateTaskInput, Task, TaskStatus } from "@/types/task";

interface TaskRow extends RowDataPacket {
  id: number;
  title: string;
  status: TaskStatus;
  created_at: Date;
}

function toTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    status: row.status,
    createdAt: row.created_at.toISOString(),
  };
}

export async function listTasks(): Promise<Task[]> {
  const [rows] = await pool.execute<TaskRow[]>(
    "SELECT id, title, status, created_at FROM tasks ORDER BY created_at DESC, id DESC"
  );
  return rows.map(toTask);
}

export async function findTask(id: number): Promise<Task | null> {
  const [rows] = await pool.execute<TaskRow[]>(
    "SELECT id, title, status, created_at FROM tasks WHERE id = ?",
    [id]
  );
  const row = rows[0];
  return row ? toTask(row) : null;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO tasks (title, status) VALUES (?, ?)",
    [input.title, input.status]
  );
  const created = await findTask(result.insertId);
  if (!created) throw new Error("Task was inserted but could not be read back.");
  return created;
}

export async function updateTaskStatus(id: number, status: TaskStatus): Promise<Task | null> {
  const [result] = await pool.execute<ResultSetHeader>(
    "UPDATE tasks SET status = ? WHERE id = ?",
    [status, id]
  );
  // mysql2 reports matched rows (not changed rows), so 0 means the id does not exist.
  if (result.affectedRows === 0) return null;
  return findTask(id);
}

export async function deleteTask(id: number): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>("DELETE FROM tasks WHERE id = ?", [id]);
  return result.affectedRows > 0;
}
