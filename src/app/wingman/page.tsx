"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { ChatMessage } from "@/lib/wingman";

const SUGGESTIONS = [
  "Sie hat auf mein Match nicht geantwortet – was jetzt?",
  "Hilf mir, eine erste Nachricht zu schreiben",
  "Ich war auf einem Date und weiß nicht, wie ich weitermache",
  "Ich habe eine Absage bekommen",
];

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hey, ich bin Leo – dein Wingman. 💪 Ich bin rund um die Uhr für dich da, zwischen deinen Sessions mit Julia. Erzähl mir, was gerade ansteht: ein Match, ein Date, eine Nachricht? Lass uns das zusammen angehen.",
};

export default function WingmanPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    const history = [...messages, { role: "user", content: trimmed } as ChatMessage];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch("/api/wingman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Begrüßung nicht mitschicken – das ist nur UI.
        body: JSON.stringify({ messages: history.slice(1) }),
      });

      if (!res.body) throw new Error("Kein Stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: acc };
          return next;
        });
      }
    } catch {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          content:
            "⚠️ Verbindung unterbrochen. Versuch es bitte gleich nochmal.",
        };
        return next;
      });
    } finally {
      setStreaming(false);
    }
  }

  return (
    <main className="mx-auto flex h-screen w-full max-w-3xl flex-col px-4 py-6 sm:px-6">
      {/* Topbar */}
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted transition hover:border-primary hover:text-foreground"
        >
          ← Dashboard
        </Link>
        <span className="text-xs uppercase tracking-[0.3em] text-accent">
          KI-Wingman
        </span>
      </div>

      {/* Kopf */}
      <header className="mb-4 flex items-center gap-4 rounded-2xl border border-primary/40 bg-surface p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-2xl">
          🤝
        </div>
        <div className="leading-tight">
          <h1 className="text-2xl text-foreground">Leo · Dein Wingman</h1>
          <p className="text-sm text-muted">
            24/7 an deiner Seite – zwischen den Sessions mit Julia.
          </p>
        </div>
      </header>

      {/* Verlauf */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-border bg-surface/60 p-4"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${
                m.role === "user"
                  ? "bg-primary text-white"
                  : "border border-border bg-surface-2 text-foreground"
              }`}
            >
              {m.content || (
                <span className="inline-flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted" />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Schnell-Vorschläge (nur am Anfang) */}
      {messages.length === 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-border bg-surface-2 px-3 py-1.5 text-xs text-muted transition hover:border-primary hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Eingabe */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-4 flex items-end gap-2"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          rows={1}
          placeholder="Schreib Leo, was gerade ansteht …"
          className="max-h-40 flex-1 resize-none rounded-xl border border-border bg-surface-2 px-4 py-3 text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
        <button
          type="submit"
          disabled={streaming || !input.trim()}
          className="rounded-xl bg-primary px-5 py-3 font-display tracking-wide text-white transition hover:bg-primary-soft disabled:opacity-50"
        >
          {streaming ? "…" : "Senden"}
        </button>
      </form>
    </main>
  );
}
