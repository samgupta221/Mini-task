"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import * as api from "@/lib/api-client";
import { STATUS_LABELS, TASK_STATUSES, type CreateTaskInput, type Task, type TaskStatus } from "@/types/task";
import { TaskForm } from "@/components/TaskForm";
import { TaskItem } from "@/components/TaskItem";

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyIds, setBusyIds] = useState<ReadonlySet<number>>(new Set());

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setTasks(await api.fetchTasks());
    } catch (error) {
      setLoadError(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  const tasksByStatus = useMemo(() => {
    const groups: Record<TaskStatus, Task[]> = { todo: [], "in-progress": [], done: [] };
    for (const task of tasks) groups[task.status].push(task);
    return groups;
  }, [tasks]);

  function setBusy(id: number, busy: boolean) {
    setBusyIds((current) => {
      const next = new Set(current);
      if (busy) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  async function handleCreate(input: CreateTaskInput) {
    setActionError(null);
    try {
      const created = await api.createTask(input);
      setTasks((current) => [created, ...current]);
    } catch (error) {
      setActionError(errorMessage(error));
      throw error; // lets the form keep the typed title
    }
  }

  // Optimistic: move the task right away, roll back if the server says no.
  async function handleStatusChange(task: Task, status: TaskStatus) {
    if (task.status === status) return;
    setActionError(null);
    setBusy(task.id, true);
    setTasks((current) => current.map((t) => (t.id === task.id ? { ...t, status } : t)));
    try {
      await api.updateTaskStatus(task.id, status);
    } catch (error) {
      setTasks((current) => current.map((t) => (t.id === task.id ? { ...t, status: task.status } : t)));
      setActionError(`Could not update "${task.title}". ${errorMessage(error)}`);
    } finally {
      setBusy(task.id, false);
    }
  }

  async function handleDelete(task: Task) {
    setActionError(null);
    setBusy(task.id, true);
    try {
      await api.deleteTask(task.id);
      setTasks((current) => current.filter((t) => t.id !== task.id));
    } catch (error) {
      setActionError(`Could not delete "${task.title}". ${errorMessage(error)}`);
    } finally {
      setBusy(task.id, false);
    }
  }

  return (
    <div className="board">
      <TaskForm onSubmit={handleCreate} />

      {actionError && (
        <div className="banner banner--error" role="alert">
          <span>{actionError}</span>
          <button type="button" className="button button--quiet" onClick={() => setActionError(null)}>
            Dismiss
          </button>
        </div>
      )}

      {loading && (
        <p className="state-message" role="status">
          Loading tasks…
        </p>
      )}

      {!loading && loadError && (
        <div className="banner banner--error" role="alert">
          <span>{loadError}</span>
          <button type="button" className="button" onClick={() => void loadTasks()}>
            Try again
          </button>
        </div>
      )}

      {!loading && !loadError && tasks.length === 0 && (
        <p className="state-message">No tasks yet. Add your first one above.</p>
      )}

      {!loading && !loadError && tasks.length > 0 && (
        <div className="lanes">
          {TASK_STATUSES.map((status) => (
            <section key={status} className="lane" data-status={status} aria-labelledby={`lane-${status}`}>
              <h2 id={`lane-${status}`} className="lane__heading">
                {STATUS_LABELS[status]}
                <span className="lane__count">{tasksByStatus[status].length}</span>
              </h2>
              {tasksByStatus[status].length === 0 ? (
                <p className="lane__empty">Nothing here.</p>
              ) : (
                <ul className="lane__list">
                  {tasksByStatus[status].map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      busy={busyIds.has(task.id)}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                    />
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
