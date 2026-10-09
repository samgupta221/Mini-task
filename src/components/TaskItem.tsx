"use client";

import { isTaskStatus } from "@/lib/task-rules";
import { STATUS_LABELS, TASK_STATUSES, type Task, type TaskStatus } from "@/types/task";

interface TaskItemProps {
  task: Task;
  busy: boolean;
  onStatusChange: (task: Task, status: TaskStatus) => void;
  onDelete: (task: Task) => void;
}

export function TaskItem({ task, busy, onStatusChange, onDelete }: TaskItemProps) {
  return (
    <li className="task" data-busy={busy}>
      <p className="task__title">{task.title}</p>
      <div className="task__actions">
        <label className="visually-hidden" htmlFor={`status-${task.id}`}>
          Status for {task.title}
        </label>
        <select
          id={`status-${task.id}`}
          value={task.status}
          disabled={busy}
          onChange={(event) => {
            if (isTaskStatus(event.target.value)) onStatusChange(task, event.target.value);
          }}
        >
          {TASK_STATUSES.map((value) => (
            <option key={value} value={value}>
              {STATUS_LABELS[value]}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="button button--quiet"
          disabled={busy}
          onClick={() => onDelete(task)}
          aria-label={`Delete ${task.title}`}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
