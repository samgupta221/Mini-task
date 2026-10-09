import { NextResponse } from "next/server";
import { HttpError, errorResponse } from "@/lib/errors";
import { deleteTask, updateTaskStatus } from "@/lib/tasks-repo";
import { parseTaskId, parseUpdateStatus, readJsonBody } from "@/lib/validation";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: { id: string };
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const id = parseTaskId(params.id);
    const { status } = parseUpdateStatus(await readJsonBody(request));
    const task = await updateTaskStatus(id, status);
    if (!task) throw new HttpError(404, "Task not found.");
    return NextResponse.json(task);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const id = parseTaskId(params.id);
    const deleted = await deleteTask(id);
    if (!deleted) throw new HttpError(404, "Task not found.");
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return errorResponse(error);
  }
}
