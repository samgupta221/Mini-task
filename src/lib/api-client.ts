import type {
  ApiErrorBody,
  CreateTaskInput,
  Task,
  TaskStatus,
  UpdateTaskStatusInput,
} from "@/types/task";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new Error("Could not reach the server. Check your connection and try again.");
  }

  if (!response.ok) {
    let message = `Request failed (${response.status}).`;
    try {
      const body = (await response.json()) as Partial<ApiErrorBody>;
      if (typeof body.error === "string") message = body.error;
    } catch {
      // Response had no JSON body; keep the generic message.
    }
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export function fetchTasks(): Promise<Task[]> {
  return request<Task[]>("/api/tasks", { cache: "no-store" });
}

export function createTask(input: CreateTaskInput): Promise<Task> {
  return request<Task>("/api/tasks", { method: "POST", body: JSON.stringify(input) });
}

export function updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
  const body: UpdateTaskStatusInput = { status };
  return request<Task>(`/api/tasks/${id}`, { method: "PATCH", body: JSON.stringify(body) });
}

export function deleteTask(id: number): Promise<void> {
  return request<void>(`/api/tasks/${id}`, { method: "DELETE" });
}
