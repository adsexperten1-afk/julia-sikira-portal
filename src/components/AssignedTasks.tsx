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
    const nowDone = items.find((t) => t.id === id)?.status !== "done";
    setItems((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: nowDone ? "done" : "open" } : t,
      ),
    );
    startTransition(() => {
      toggleTask(id, nowDone);
    });
  }

  const total = items.length;
  const completed = items.filter((t) => t.status === "done").length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  // Die "aktuelle" Station = erste noch offene Aufgabe in der Reihenfolge.
  const currentIndex = items.findIndex((t) => t.status === "open");

  return (
    <section className="rounded-2xl border border-primary/50 bg-surface p-6">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-2xl text-foreground">Deine Roadmap</h2>
        <span className="text-sm text-muted">
          {completed} / {total} geschafft
        </span>
      </div>
      <p className="mb-5 text-sm text-muted">
        Dein persönlicher Weg mit Julia – Station für Station bis zum Ziel.
      </p>

      {total === 0 ? (
        <p className="rounded-xl border border-border bg-surface-2 px-4 py-6 text-center text-sm text-muted">
          Deine Roadmap wird gerade von Julia zusammengestellt. Schau bald wieder
          vorbei – oder frag deinen KI-Coach, was du schon vorbereiten kannst. 💪
        </p>
      ) : (
        <>
          <div className="mb-6 h-3 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>

          <ol className="relative space-y-1">
            {items.map((task, i) => {
              const done = task.status === "done";
              const isCurrent = i === currentIndex;
              const isLast = i === items.length - 1;

              return (
                <li key={task.id} className="relative flex gap-4 pb-2">
                  {/* Verbindungslinie zur nächsten Station */}
                  {!isLast && (
                    <span
                      className={`absolute left-[15px] top-9 h-[calc(100%-1rem)] w-0.5 ${
                        done ? "bg-success/50" : "bg-border"
                      }`}
                    />
                  )}

                  {/* Stations-Knoten */}
                  <button
                    onClick={() => toggle(task.id)}
                    aria-label={done ? "Als offen markieren" : "Als erledigt markieren"}
                    className={`relative z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition ${
                      done
                        ? "border-success bg-success text-white"
                        : isCurrent
                          ? "border-accent bg-accent/15 text-accent animate-pulse"
                          : "border-border bg-surface-2 text-muted"
                    }`}
                  >
                    {done ? "✓" : isCurrent ? "▶" : i + 1}
                  </button>

                  {/* Stations-Inhalt */}
                  <div
                    className={`flex-1 rounded-xl border p-3 transition ${
                      done
                        ? "border-success/30 bg-success/5"
                        : isCurrent
                          ? "border-accent/50 bg-accent/5"
                          : "border-border bg-surface-2"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`font-medium ${
                          done ? "text-muted line-through" : "text-foreground"
                        }`}
                      >
                        {task.title}
                      </span>
                      {isCurrent && (
                        <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                          Dran
                        </span>
                      )}
                    </div>
                    {task.detail && (
                      <p className="mt-1 text-sm text-muted">{task.detail}</p>
                    )}
                    {!done && (
                      <button
                        onClick={() => toggle(task.id)}
                        className="mt-2 text-xs font-semibold text-primary-soft transition hover:text-foreground"
                      >
                        Als erledigt markieren →
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          {completed === total && (
            <p className="mt-4 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-center text-sm text-foreground">
              🎉 Du hast deine ganze Roadmap gemeistert – stark! Bring deine
              Erfolge mit in die nächste Session.
            </p>
          )}
        </>
      )}
    </section>
  );
}
