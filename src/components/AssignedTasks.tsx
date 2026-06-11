"use client";

import { useState, useTransition } from "react";
import { toggleTask } from "@/app/actions/tasks";

export type AssignedTask = {
  id: string;
  title: string;
  detail: string | null;
  status: "open" | "done";
};

export default function AssignedTasks({ tasks }: { tasks: AssignedTask[] }) {
  // Lokaler Spiegel für sofortiges Feedback beim Abhaken.
  const [items, setItems] = useState(tasks);
  const [, startTransition] = useTransition();

  function toggle(id: string) {
    setItems((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "done" ? "open" : "done" }
          : t,
      ),
    );
    const nowDone =
      items.find((t) => t.id === id)?.status !== "done";
    startTransition(() => {
      toggleTask(id, nowDone);
    });
  }

  const total = items.length;
  const completed = items.filter((t) => t.status === "done").length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="rounded-2xl border border-primary/50 bg-surface p-6">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-2xl text-foreground">Deine Aufgaben</h2>
        <span className="text-sm text-muted">
          {completed} / {total} erledigt
        </span>
      </div>
      <p className="mb-4 text-sm text-muted">
        Deine persönlichen Hausaufgaben von Julia bis zur nächsten Session.
      </p>

      {total === 0 ? (
        <p className="rounded-xl border border-border bg-surface-2 px-4 py-6 text-center text-sm text-muted">
          Aktuell sind dir keine Aufgaben zugewiesen. Julia meldet sich – oder
          frag deinen KI-Coach, was du schon vorbereiten kannst. 💪
        </p>
      ) : (
        <>
          <div className="mb-5 h-3 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>

          <ul className="space-y-2.5">
            {items.map((task) => {
              const checked = task.status === "done";
              return (
                <li key={task.id}>
                  <button
                    onClick={() => toggle(task.id)}
                    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
                      checked
                        ? "border-success/40 bg-success/5"
                        : "border-border bg-surface-2 hover:border-primary"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 text-sm font-bold transition ${
                        checked
                          ? "border-success bg-success text-white"
                          : "border-border text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                    <span>
                      <span
                        className={`block font-medium ${
                          checked
                            ? "text-muted line-through"
                            : "text-foreground"
                        }`}
                      >
                        {task.title}
                      </span>
                      {task.detail && (
                        <span className="mt-0.5 block text-sm text-muted">
                          {task.detail}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {completed === total && (
            <p className="mt-4 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-center text-sm text-foreground">
              🎉 Alle Aufgaben erledigt – stark! Bring deine Erfolge mit in die
              nächste Session.
            </p>
          )}
        </>
      )}
    </section>
  );
}
