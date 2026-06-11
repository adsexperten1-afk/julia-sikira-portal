"use client";

import { useActionState, useEffect, useRef } from "react";
import { createTask, type CreateTaskState } from "@/app/actions/tasks";

const initial: CreateTaskState = {};

export default function AddTaskForm({ memberId }: { memberId: string }) {
  const [state, formAction, pending] = useActionState(createTask, initial);
  const formRef = useRef<HTMLFormElement>(null);

  // Nach Erfolg Felder leeren.
  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-2xl border border-primary/50 bg-surface p-5"
    >
      <h3 className="mb-3 text-lg text-foreground">Neue Aufgabe zuweisen</h3>
      <input type="hidden" name="member_id" value={memberId} />

      <label className="mb-1.5 block text-sm font-medium text-foreground">
        Titel
      </label>
      <input
        name="title"
        required
        placeholder="z. B. Profiltext überarbeiten"
        className="mb-3 w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/30"
      />

      <label className="mb-1.5 block text-sm font-medium text-foreground">
        Beschreibung (optional)
      </label>
      <textarea
        name="detail"
        rows={3}
        placeholder="Worauf soll er achten? Konkrete Anleitung …"
        className="mb-3 w-full resize-none rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/30"
      />

      {state.error && (
        <p className="mb-3 text-sm text-accent-soft">{state.error}</p>
      )}
      {state.success && (
        <p className="mb-3 text-sm text-success">✓ Aufgabe zugewiesen.</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-primary px-4 py-2.5 font-display tracking-wide text-white transition hover:bg-primary-soft disabled:opacity-60"
      >
        {pending ? "Speichern …" : "Aufgabe zuweisen"}
      </button>
    </form>
  );
}
