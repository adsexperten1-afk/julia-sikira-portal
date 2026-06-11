"use client";

import { useEffect, useState } from "react";
import { weeklyTasks } from "@/lib/journey";

const STORAGE_KEY = "portal.tasks.v1";

export default function TaskList() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  // Beim ersten Render aus dem Browser-Speicher laden.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch {
      /* ignorieren */
    }
    setLoaded(true);
  }, []);

  // Bei jeder Änderung speichern.
  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
  }, [done, loaded]);

  function toggle(id: string) {
    setDone((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const completed = weeklyTasks.filter((t) => done[t.id]).length;
  const total = weeklyTasks.length;
  const percent = Math.round((completed / total) * 100);

  return (
    <section className="rounded-2xl border border-primary/50 bg-surface p-6">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-2xl text-foreground">Diese Woche</h2>
        <span className="text-sm text-muted">
          {completed} / {total} erledigt
        </span>
      </div>
      <p className="mb-4 text-sm text-muted">
        Deine konkreten Schritte bis zur nächsten Session. Hak ab, was du
        geschafft hast.
      </p>

      {/* Echter Fortschritt */}
      <div className="mb-5 h-3 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ul className="space-y-2.5">
        {weeklyTasks.map((task) => {
          const checked = !!done[task.id];
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
                  <span className="mt-0.5 block text-sm text-muted">
                    {task.detail}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {completed === total && (
        <p className="mt-4 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-center text-sm text-foreground">
          🎉 Alles erledigt – starke Woche! Bring deine Erfolge mit in die
          nächste Session.
        </p>
      )}
    </section>
  );
}
