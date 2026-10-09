import { HttpError } from "@/lib/errors";
import { isTaskStatus, validateTitle } from "@/lib/task-rules";
import { TASK_STATUSES, type CreateTaskInput, type UpdateTaskStatusInput } from "@/types/task";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseCreateTask(body: unknown): CreateTaskInput {
  if (!isRecord(body)) throw new HttpError(400, "Request body must be a JSON object.");

  if (typeof body.title !== "string") throw new HttpError(400, "Task title is required.");
  const titleError = validateTitle(body.title);
  if (titleError) throw new HttpError(400, titleError);

  const status = body.status ?? "todo";
  if (!isTaskStatus(status)) {
    throw new HttpError(400, `Status must be one of: ${TASK_STATUSES.join(", ")}.`);
  }

  return { title: body.title.trim(), status };
}

export function parseUpdateStatus(body: unknown): UpdateTaskStatusInput {
  if (!isRecord(body)) throw new HttpError(400, "Request body must be a JSON object.");
  if (!isTaskStatus(body.status)) {
    throw new HttpError(400, `Status must be one of: ${TASK_STATUSES.join(", ")}.`);
  }
  return { status: body.status };
}

export function parseTaskId(raw: string): number {
  if (!/^\d+$/.test(raw)) throw new HttpError(400, "Task id must be a positive integer.");
  const id = Number(raw);
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new HttpError(400, "Task id must be a positive integer.");
  }
  return id;
}

export async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new HttpError(400, "Request body must be valid JSON.");
  }
}
