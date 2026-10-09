import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/errors";
import { createTask, listTasks } from "@/lib/tasks-repo";
import { parseCreateTask, readJsonBody } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tasks = await listTasks();
    return NextResponse.json(tasks);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const input = parseCreateTask(await readJsonBody(request));
    const task = await createTask(input);
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
