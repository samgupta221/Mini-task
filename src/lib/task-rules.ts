import { TASK_STATUSES, type TaskStatus } from "@/types/task";

export const MAX_TITLE_LENGTH = 200;

export function isTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === "string" && (TASK_STATUSES as readonly string[]).includes(value);
}

export function validateTitle(title: string): string | null {
  const trimmed = title.trim();
  if (trimmed.length === 0) return "Task title cannot be empty.";
  if (trimmed.length > MAX_TITLE_LENGTH) {
    return `Task title must be ${MAX_TITLE_LENGTH} characters or fewer.`;
  }
  return null;
}
