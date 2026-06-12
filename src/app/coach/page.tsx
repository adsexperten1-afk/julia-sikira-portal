import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";
import { deleteTask } from "@/app/actions/tasks";
import AddTaskForm from "@/components/AddTaskForm";
import MoveTaskButtons from "@/components/MoveTaskButtons";

type Member = { id: string; first_name: string | null };
type Task = {
  id: string;
  title: string;
  detail: string | null;
  status: "open" | "done";
  position: number;
};

export default async function CoachPage({
  searchParams,
}: {
  searchParams: Promise<{ member?: string }>;
}) {
  // Ohne Supabase gibt es keinen echten Coach-Bereich.
  if (!supabaseConfigured) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4 py-12 text-center sm:px-6">
        <h1 className="text-3xl text-foreground">Coach-Bereich</h1>
        <p className="mt-3 text-muted">
          Dieser Bereich braucht den echten Login (Supabase). Folge der
          Einrichtung in <code className="text-accent">SETUP.md</code>.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-foreground"
        >
          ← Zum Dashboard
        </Link>
      </main>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Nur Coaches dürfen hier rein.
  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (me?.role !== "coach") redirect("/dashboard");

  const { data: members } = await supabase
    .from("profiles")
    .select("id, first_name")
    .eq("role", "member")
    .order("first_name", { ascending: true });

  const memberList = (members ?? []) as Member[];
  const selectedId = (await searchParams).member ?? null;
  const selected = memberList.find((m) => m.id === selectedId) ?? null;

  let tasks: Task[] = [];
  if (selected) {
    const { data } = await supabase
      .from("tasks")
      .select("id, title, detail, status, position")
      .eq("member_id", selected.id)
      .order("position", { ascending: true });
    tasks = (data ?? []) as Task[];
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.3em] text-accent">
          Coach-Bereich · Julia
        </span>
        <Link
          href="/dashboard"
          className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted transition hover:border-primary hover:text-foreground"
        >
          Mein Dashboard →
        </Link>
      </div>

      <header className="mb-8">
        <h1 className="text-4xl text-foreground">Hausaufgaben verwalten</h1>
        <p className="mt-2 text-muted">
          Wähl einen Teilnehmer und weise ihm persönliche Aufgaben bis zur
          nächsten Session zu.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
        {/* Teilnehmer-Liste */}
        <aside>
          <h2 className="mb-3 text-sm uppercase tracking-widest text-muted">
            Teilnehmer ({memberList.length})
          </h2>
          {memberList.length === 0 ? (
            <p className="rounded-xl border border-border bg-surface-2 p-4 text-sm text-muted">
              Noch keine Teilnehmer. Lege sie in Supabase unter Authentication →
              Users an (siehe SETUP.md).
            </p>
          ) : (
            <ul className="space-y-2">
              {memberList.map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/coach?member=${m.id}`}
                    className={`block rounded-xl border px-4 py-3 text-sm transition ${
                      selected?.id === m.id
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-surface-2 text-muted hover:border-primary hover:text-foreground"
                    }`}
                  >
                    {m.first_name || "Teilnehmer"}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* Aufgaben des gewählten Teilnehmers */}
        <section>
          {!selected ? (
            <div className="rounded-2xl border border-border bg-surface p-8 text-center text-muted">
              ← Wähl links einen Teilnehmer aus.
            </div>
          ) : (
            <div className="space-y-6">
              <AddTaskForm memberId={selected.id} />

              <div>
                <h2 className="mb-1 text-xl text-foreground">
                  Roadmap von {selected.first_name || "Teilnehmer"}
                </h2>
                <p className="mb-3 text-sm text-muted">
                  Die Reihenfolge ist der Weg, den der Teilnehmer sieht. Mit den
                  Pfeilen verschiebst du die Stationen.
                </p>
                {tasks.length === 0 ? (
                  <p className="rounded-xl border border-border bg-surface-2 p-4 text-sm text-muted">
                    Noch keine Stationen. Leg oben die erste Aufgabe an.
                  </p>
                ) : (
                  <ul className="space-y-2.5">
                    {tasks.map((t, i) => (
                      <li
                        key={t.id}
                        className="flex items-start gap-3 rounded-xl border border-border bg-surface-2 p-3"
                      >
                        <MoveTaskButtons
                          id={t.id}
                          isFirst={i === 0}
                          isLast={i === tasks.length - 1}
                        />
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-xs font-bold text-muted">
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                t.status === "done"
                                  ? "bg-success/15 text-success"
                                  : "bg-accent/15 text-accent"
                              }`}
                            >
                              {t.status === "done" ? "Erledigt" : "Offen"}
                            </span>
                            <span className="font-medium text-foreground">
                              {t.title}
                            </span>
                          </div>
                          {t.detail && (
                            <p className="mt-1 text-sm text-muted">{t.detail}</p>
                          )}
                        </div>
                        <form action={deleteTask.bind(null, t.id)}>
                          <button
                            type="submit"
                            className="shrink-0 text-xs text-muted transition hover:text-accent"
                          >
                            Löschen
                          </button>
                        </form>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
