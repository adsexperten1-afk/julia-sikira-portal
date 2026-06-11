"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/actions/auth";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      {/* Hintergrund-Glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, #2e7dff, transparent)" }}
      />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            Julia Sikira
          </p>
          <h1 className="mt-2 text-4xl text-foreground">Deine Heldenreise</h1>
          <p className="mt-2 text-muted">
            Melde dich an und nimm dein Abenteuer wieder auf.
          </p>
        </div>

        <form
          action={formAction}
          className="space-y-5 rounded-2xl border border-border bg-surface p-8"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              E-Mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/30"
              placeholder="du@beispiel.de"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Passwort
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/30"
              placeholder="••••••••"
            />
          </div>

          {state.error && (
            <p className="text-sm text-accent-soft">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-primary px-4 py-3 font-display text-lg tracking-wide text-white transition hover:bg-primary-soft disabled:opacity-60"
          >
            {pending ? "Wird geladen …" : "Reise fortsetzen"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Noch kein Zugang? Sprich Julia in deiner nächsten Session an.
        </p>
      </div>
    </main>
  );
}
