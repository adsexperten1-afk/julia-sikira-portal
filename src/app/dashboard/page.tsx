import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";
import { heroFirstName, modules } from "@/lib/journey";
import TaskList from "@/components/TaskList";
import Logbook from "@/components/Logbook";

export default async function DashboardPage() {
  let name = heroFirstName;

  if (supabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    name =
      (user?.user_metadata?.first_name as string) ??
      user?.email?.split("@")[0] ??
      heroFirstName;
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      {/* Topbar */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.3em] text-accent">
          Julia Sikira · Dein Coaching
        </span>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted transition hover:border-primary hover:text-foreground"
          >
            Abmelden
          </button>
        </form>
      </div>

      {/* Begrüßung */}
      <header className="relative mb-8 overflow-hidden rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #2e7dff, transparent)" }}
        />
        <div className="relative">
          <p className="text-sm text-muted">Willkommen zurück,</p>
          <h1 className="mt-1 text-4xl text-foreground sm:text-5xl">{name}</h1>
          <p className="mt-3 max-w-xl text-muted">
            Dein Coaching geht zwischen den Sessions weiter. Erledige deine
            Aufgaben, nutze den Werkzeugkasten und halt deine Fortschritte fest.
          </p>
        </div>
      </header>

      {!supabaseConfigured && (
        <div className="mb-8 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-foreground">
          <strong>Demo-Modus.</strong> Aufgaben und Logbuch werden aktuell in
          deinem Browser gespeichert. Mit dem Kunden-Login (Supabase) wandern sie
          ins persönliche Konto.
        </div>
      )}

      {/* KI-Coach Julia */}
      <Link
        href="/wingman"
        className="group relative mb-8 flex items-center gap-4 overflow-hidden rounded-2xl border border-accent/50 bg-gradient-to-r from-surface to-surface-2 p-5 transition hover:border-accent"
      >
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #ff7a1a, transparent)" }}
        />
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-3xl">
          🤝
        </div>
        <div className="relative flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl text-foreground">Julia · Dein KI-Coach</h2>
            <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
              24/7
            </span>
          </div>
          <p className="mt-1 text-sm text-muted">
            Festgefahren bei einem Match, Date oder einer Nachricht? Frag Julia
            – sie ist jederzeit für dich da.
          </p>
        </div>
        <span className="relative shrink-0 rounded-xl bg-accent px-4 py-2.5 font-display tracking-wide text-white transition group-hover:bg-accent-soft">
          Chatten →
        </span>
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        {/* Linke Spalte: Aufgaben + Werkzeugkasten */}
        <div className="space-y-8">
          <TaskList />

          {/* Werkzeugkasten-Teaser */}
          <section className="rounded-2xl border border-border bg-surface p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl text-foreground">Julias Werkzeugkasten</h2>
              <Link
                href="/werkzeugkasten"
                className="text-sm text-primary-soft transition hover:text-foreground"
              >
                Alle ansehen →
              </Link>
            </div>
            <p className="mb-4 text-sm text-muted">
              Julias Methode in kompakten Modulen – plus Vorlagen zum Kopieren.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {modules.map((mod) => (
                <Link
                  key={mod.id}
                  href="/werkzeugkasten"
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface-2 p-3 transition hover:border-primary"
                >
                  <span className="text-2xl">{mod.icon}</span>
                  <span className="text-sm font-medium text-foreground">
                    {mod.title}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Rechte Spalte: Logbuch */}
        <aside>
          <Logbook />
        </aside>
      </div>
    </main>
  );
}
