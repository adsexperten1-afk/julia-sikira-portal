import Anthropic from "@anthropic-ai/sdk";
import {
  WINGMAN_MODEL,
  WINGMAN_SYSTEM_PROMPT,
  wingmanConfigured,
  demoWingmanReply,
  type ChatMessage,
} from "@/lib/wingman";

// Antworten kommen live als Text-Stream zurück (Server-Sent-Plain-Text).
export const dynamic = "force-dynamic";

const encoder = new TextEncoder();

export async function POST(request: Request) {
  let messages: ChatMessage[] = [];
  try {
    const body = await request.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return new Response("Ungültige Anfrage.", { status: 400 });
  }

  // Nur Rolle + Inhalt durchlassen, Inhalt deckeln.
  const cleaned: ChatMessage[] = messages
    .filter(
      (m) =>
        (m?.role === "user" || m?.role === "assistant") &&
        typeof m?.content === "string" &&
        m.content.trim().length > 0,
    )
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

  if (cleaned.length === 0) {
    return new Response("Keine Nachricht erhalten.", { status: 400 });
  }

  // ---- Demo-Modus: simulierte Antwort streamen ----------------------
  if (!wingmanConfigured) {
    const lastUser = [...cleaned].reverse().find((m) => m.role === "user");
    const reply = demoWingmanReply(lastUser?.content ?? "");
    const words = reply.split(/(\s+)/);

    const stream = new ReadableStream({
      async start(controller) {
        for (const word of words) {
          controller.enqueue(encoder.encode(word));
          // kleine Verzögerung, damit es sich „getippt" anfühlt
          await new Promise((r) => setTimeout(r, 18));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Wingman-Mode": "demo",
      },
    });
  }

  // ---- Echter Modus: Claude streamen --------------------------------
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const claudeStream = client.messages.stream({
          model: WINGMAN_MODEL,
          max_tokens: 1024,
          thinking: { type: "adaptive" },
          system: [
            {
              type: "text",
              text: WINGMAN_SYSTEM_PROMPT,
              // System-Prompt cachen: spart Kosten/Latenz über viele Turns.
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: cleaned.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        });

        claudeStream.on("text", (textDelta) => {
          controller.enqueue(encoder.encode(textDelta));
        });

        await claudeStream.finalMessage();
        controller.close();
      } catch (err) {
        console.error("Wingman-Fehler:", err);
        controller.enqueue(
          encoder.encode(
            "\n\n⚠️ Da ist gerade etwas schiefgelaufen. Versuch es gleich nochmal – ich bin dann wieder für dich da.",
          ),
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Wingman-Mode": "live",
    },
  });
}
