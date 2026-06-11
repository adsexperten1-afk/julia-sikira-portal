import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";
import {
  hero,
  heroFirstName,
  ranks,
  stages,
  weeklyMission,
  badges,
  xpPercent,
  type StageStatus,
} from "@/lib/coaching";

const nodeStyles: Record<StageStatus, string> = {
  done: "border-primary bg-primary text-white",
  current: "border-primary bg-primary/20 text-primary pulse-glow",
  locked: "border-border bg-surface-2 text-locked",
};

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

  const xp = xpPercent();
  const nextRank = ranks[Math.min(ranks.indexOf(hero.rank) + 1, ranks.length - 1)];

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      {/* Topbar */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.3em] text-accent">
          Julia Sikira · Heldenreise
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

      {/* Helden-Header */}
      <header className="relative mb-8 overflow-hidden rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #2e7dff, transparent)" }}
        />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-sm text-muted">Willkommen zurück, Held.</p>
            <h1 className="mt-1 text-4xl text-foreground sm:text-5xl">{name}</h1>
            <div className="mt-3 flex items-center gap-3">
              <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
                {hero.rank}
              </span>
              <span className="text-sm text-muted">
                Level {hero.level}
              </span>
            </div>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-4 py-3">
            <span className="text-2xl">🔥</span>
            <div className="leading-tight">
              <p className="font-display text-2xl text-accent">
                {hero.streakDays}
              </p>
              <p className="text-xs text-muted">Tage am Stück</p>
            </div>
          </div>
        </div>

        {/* XP-Leiste */}
        <div className="relative mt-6">
          <div className="mb-1.5 flex justify-between text-xs text-muted">
            <span>
              {hero.xp} / {hero.xpForNext} XP
            </span>
            <span>
              Nächster Rang:{" "}
              <span className="text-foreground">{nextRank}</span>
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
              style={{ width: `${xp}%` }}
            />
          </div>
        </div>
      </header>

      {!supabaseConfigured && (
        <div className="mb-8 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-foreground">
          <strong>Demo-Modus.</strong> Mit den Supabase-Keys in{" "}
          <code className="text-accent">.env.local</code> läuft hier der echte
          Login mit Spielstand je Held.
        </div>
      )}

      {/* KI-Wingman – der ständige Begleiter */}
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
        {/* Linke Spalte */}
        <div className="space-y-8">
          {/* Mission der Woche */}
          <section className="relative overflow-hidden rounded-2xl border border-primary/50 bg-surface p-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-primary-soft">
                {weeklyMission.label}
              </span>
              <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
                +{weeklyMission.xpReward} XP
              </span>
            </div>
            <h2 className="text-2xl text-foreground">{weeklyMission.title}</h2>
            <p className="mt-2 text-sm text-muted">
              {weeklyMission.description}
            </p>

            <div className="mt-4 rounded-xl border border-border bg-surface-2 p-4">
              <p className="text-xs uppercase tracking-widest text-accent">
                Briefing von Julia
              </p>
              <p className="mt-1 text-sm italic text-foreground/90">
                „{weeklyMission.mentorBriefing}"
              </p>
            </div>

            <button className="mt-5 w-full rounded-xl bg-primary px-4 py-3 font-display text-lg tracking-wide text-white transition hover:bg-primary-soft">
              Mission starten
            </button>
          </section>

          {/* Quest-Map */}
          <section>
            <h2 className="mb-5 text-2xl text-foreground">Deine Reise</h2>
            <ol className="relative ml-3 space-y-6 border-l-2 border-border pl-8">
              {stages.map((stage) => (
                <li key={`${stage.chapter}-${stage.title}`} className="relative">
                  {/* Knoten auf der Linie */}
                  <span
                    className={`absolute -left-[42px] flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold ${nodeStyles[stage.status]}`}
                  >
                    {stage.status === "done"
                      ? "✓"
                      : stage.status === "locked"
                        ? "🔒"
                        : "▶"}
                  </span>

                  <div
                    className={`rounded-xl border p-4 ${
                      stage.status === "current"
                        ? "border-primary bg-surface"
                        : "border-border bg-surface/60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-widest text-muted">
                        {stage.chapter}
                      </span>
                      {stage.isBoss && (
                        <span className="rounded bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                          Boss
                        </span>
                      )}
                    </div>
                    <h3
                      className={`mt-1 text-lg ${
                        stage.status === "locked"
                          ? "text-muted"
                          : "text-foreground"
                      }`}
                    >
                      {stage.title}
                    </h3>
                    <p className="text-sm text-muted">{stage.subtitle}</p>
                    <p className="mt-2 text-xs font-semibold text-accent">
                      +{stage.xpReward} XP
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Rechte Spalte */}
        <aside className="space-y-8">
          {/* Abzeichen */}
          <section className="rounded-2xl border border-border bg-surface p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl text-foreground">Trophäen</h2>
              <span className="text-xs text-muted">
                {badges.filter((b) => b.unlocked).length}/{badges.length}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.label}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition ${
                    badge.unlocked
                      ? "border-accent/40 bg-accent/5"
                      : "border-border bg-surface-2 opacity-50 grayscale"
                  }`}
                  title={badge.label}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <span className="text-[10px] leading-tight text-muted">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Rang-Teaser */}
          <section className="rounded-2xl border border-primary/40 bg-gradient-to-br from-surface to-surface-2 p-6">
            <p className="text-xs uppercase tracking-widest text-primary-soft">
              Dein nächstes Ziel
            </p>
            <p className="mt-2 font-display text-2xl text-foreground">
              Rang: {nextRank}
            </p>
            <p className="mt-1 text-sm text-muted">
              Noch {hero.xpForNext - hero.xp} XP – schließ deine Mission ab und
              steig auf.
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}
