"use client";

import { useState, type FormEvent } from "react";
import { MAX_TITLE_LENGTH, isTaskStatus, validateTitle } from "@/lib/task-rules";
import { STATUS_LABELS, TASK_STATUSES, type CreateTaskInput } from "@/types/task";

interface TaskFormProps {
  onSubmit: (input: CreateTaskInput) => Promise<void>;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<CreateTaskInput["status"]>("todo");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const error = validateTitle(title);
    if (error) {
      setFieldError(error);
      return;
    }

    setFieldError(null);
    setSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), status });
      setTitle("");
    } catch {
      // The parent shows the error banner; keep the typed title so nothing is lost.
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="task-form__field">
        <label htmlFor="new-task-title">New task</label>
        <input
          id="new-task-title"
          type="text"
          value={title}
          maxLength={MAX_TITLE_LENGTH}
          placeholder="What needs doing?"
          aria-invalid={fieldError !== null}
          aria-describedby={fieldError ? "new-task-error" : undefined}
          onChange={(event) => {
            setTitle(event.target.value);
            if (fieldError) setFieldError(null);
          }}
        />
        {fieldError && (
          <p id="new-task-error" className="field-error" role="alert">
            {fieldError}
          </p>
        )}
      </div>

      <div className="task-form__field task-form__field--status">
        <label htmlFor="new-task-status">Start in</label>
        <select
          id="new-task-status"
          value={status}
          onChange={(event) => {
            if (isTaskStatus(event.target.value)) setStatus(event.target.value);
          }}
        >
          {TASK_STATUSES.map((value) => (
            <option key={value} value={value}>
              {STATUS_LABELS[value]}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="button button--primary" disabled={submitting}>
        {submitting ? "Adding…" : "Add task"}
      </button>
    </form>
  );
}
