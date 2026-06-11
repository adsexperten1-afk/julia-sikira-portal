"use client";

import { useEffect, useState } from "react";
import { LOGBOOK_TYPES, type LogEntry, type LogbookType } from "@/lib/journey";

const STORAGE_KEY = "portal.logbook.v1";

const typeStyles: Record<LogbookType, string> = {
  Gespräch: "bg-primary/15 text-primary-soft",
  Date: "bg-accent/15 text-accent",
  Erfolg: "bg-success/15 text-success",
  Reflexion: "bg-surface-2 text-muted",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Logbook() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [type, setType] = useState<LogbookType>("Gespräch");
  const [text, setText] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw));
    } catch {
      /* ignorieren */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries, loaded]);

  function add() {
    const trimmed = text.trim();
    if (!trimmed) return;
    const entry: LogEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      type,
      text: trimmed,
    };
    setEntries((prev) => [entry, ...prev]);
    setText("");
  }

  function remove(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <section className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="text-2xl text-foreground">Dein Logbuch</h2>
      <p className="mb-4 mt-1 text-sm text-muted">
        Halt fest, was passiert ist – Gespräche, Dates, Erfolge, Gedanken. So
        siehst du deine Entwicklung über die Wochen.
      </p>

      {/* Neuer Eintrag */}
      <div className="mb-5 rounded-xl border border-border bg-surface-2 p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {LOGBOOK_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                type === t
                  ? "bg-primary text-white"
                  : "border border-border text-muted hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Was ist passiert? Was hast du gelernt?"
          className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
        <button
          onClick={add}
          disabled={!text.trim()}
          className="mt-3 w-full rounded-xl bg-primary px-4 py-2.5 font-display tracking-wide text-white transition hover:bg-primary-soft disabled:opacity-50"
        >
          Eintrag speichern
        </button>
      </div>

      {/* Liste */}
      {entries.length === 0 ? (
        <p className="text-center text-sm text-muted">
          Noch keine Einträge. Dein erster Schritt zählt – schreib ihn auf.
        </p>
      ) : (
        <ul className="space-y-3">
          {entries.map((e) => (
            <li
              key={e.id}
              className="group rounded-xl border border-border bg-surface-2 p-3"
            >
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${typeStyles[e.type]}`}
                  >
                    {e.type}
                  </span>
                  <span className="text-xs text-muted">
                    {formatDate(e.date)}
                  </span>
                </div>
                <button
                  onClick={() => remove(e.id)}
                  className="text-xs text-muted opacity-0 transition hover:text-accent group-hover:opacity-100"
                  aria-label="Eintrag löschen"
                >
                  Löschen
                </button>
              </div>
              <p className="whitespace-pre-wrap text-sm text-foreground/90">
                {e.text}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
