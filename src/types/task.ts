export const TASK_STATUSES = ["todo", "in-progress", "done"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  createdAt: string; // ISO 8601
}

export interface CreateTaskInput {
  title: string;
  status: TaskStatus;
}

export interface UpdateTaskStatusInput {
  status: TaskStatus;
}

export interface ApiErrorBody {
  error: string;
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To do",
  "in-progress": "In progress",
  done: "Done",
};
