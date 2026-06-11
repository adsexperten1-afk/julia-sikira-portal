import Link from "next/link";
import { modules, templates } from "@/lib/journey";

export default function WerkzeugkastenPage() {
  // Vorlagen nach Kategorie gruppieren.
  const categories = Array.from(new Set(templates.map((t) => t.category)));

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      {/* Topbar */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted transition hover:border-primary hover:text-foreground"
        >
          ← Dashboard
        </Link>
        <span className="text-xs uppercase tracking-[0.3em] text-accent">
          Julias Werkzeugkasten
        </span>
      </div>

      <header className="mb-8">
        <h1 className="text-4xl text-foreground">Julias Werkzeugkasten</h1>
        <p className="mt-2 text-muted">
          Julias Methode in kompakten Modulen – plus Vorlagen zum Kopieren. Dein
          Nachschlagewerk für jede Situation.
        </p>
      </header>

      {/* Module */}
      <section className="mb-12 space-y-5">
        {modules.map((mod) => (
          <details
            key={mod.id}
            className="group overflow-hidden rounded-2xl border border-border bg-surface"
          >
            <summary className="flex cursor-pointer list-none items-center gap-4 p-5 transition hover:bg-surface-2">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-2 text-2xl">
                {mod.icon}
              </span>
              <span className="flex-1">
                <span className="block text-lg text-foreground">
                  {mod.title}
                </span>
                <span className="block text-sm text-muted">{mod.summary}</span>
              </span>
              <span className="shrink-0 text-xs text-muted">
                {mod.readMinutes} Min · <span className="group-open:hidden">öffnen</span>
                <span className="hidden group-open:inline">schließen</span>
              </span>
            </summary>

            <div className="space-y-5 border-t border-border px-5 py-5 sm:px-[76px]">
              {mod.sections.map((sec, i) => (
                <div key={i}>
                  <h3 className="text-base text-foreground">{sec.heading}</h3>
                  <p className="mt-1 text-sm text-muted">{sec.body}</p>
                  {sec.bullets && (
                    <ul className="mt-2 space-y-1.5">
                      {sec.bullets.map((b, j) => (
                        <li
                          key={j}
                          className="flex gap-2 text-sm text-foreground/90"
                        >
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </details>
        ))}
      </section>

      {/* Vorlagen */}
      <section>
        <h2 className="mb-1 text-2xl text-foreground">Vorlagen zum Kopieren</h2>
        <p className="mb-5 text-sm text-muted">
          Als Startpunkt gedacht – pass sie immer an dich und an sie an. Die
          [Platzhalter] füllst du selbst.
        </p>

        {categories.map((cat) => (
          <div key={cat} className="mb-6">
            <h3 className="mb-3 text-xs uppercase tracking-widest text-accent">
              {cat}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {templates
                .filter((t) => t.category === cat)
                .map((t) => (
                  <div
                    key={t.id}
                    className="rounded-xl border border-border bg-surface p-4"
                  >
                    <p className="mb-2 text-sm font-medium text-foreground">
                      {t.title}
                    </p>
                    <p className="whitespace-pre-wrap rounded-lg bg-surface-2 p-3 text-sm italic text-foreground/90">
                      {t.text}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
