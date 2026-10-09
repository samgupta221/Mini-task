import { TaskBoard } from "@/components/TaskBoard";

export default function HomePage() {
  return (
    <main className="page">
      <header className="page__header">
        <h1>Mini Task Board</h1>
        <p>Add a task, then move it from To do to Done as you work.</p>
      </header>
      <TaskBoard />
    </main>
  );
}
