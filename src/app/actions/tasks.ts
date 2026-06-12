"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";

// Teilnehmer (oder Coach) hakt eine Aufgabe ab / wieder an.
export async function toggleTask(id: string, done: boolean) {
  if (!supabaseConfigured) return;
  const supabase = await createClient();
  await supabase
    .from("tasks")
    .update({
      status: done ? "done" : "open",
      done_at: done ? new Date().toISOString() : null,
    })
    .eq("id", id);
  revalidatePath("/dashboard");
}

export type CreateTaskState = { error?: string; success?: boolean };

// Coach weist einem Teilnehmer eine Aufgabe zu.
export async function createTask(
  _prev: CreateTaskState,
  formData: FormData,
): Promise<CreateTaskState> {
  if (!supabaseConfigured) return { error: "Supabase ist nicht konfiguriert." };

  const memberId = String(formData.get("member_id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const detail = String(formData.get("detail") ?? "").trim();

  if (!memberId) return { error: "Kein Teilnehmer ausgewählt." };
  if (!title) return { error: "Bitte gib der Aufgabe einen Titel." };

  const supabase = await createClient();

  // Neue Station hinten an die Roadmap anhängen: höchste Position + 1.
  const { data: last } = await supabase
    .from("tasks")
    .select("position")
    .eq("member_id", memberId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextPosition = (last?.position ?? -1) + 1;

  const { error } = await supabase.from("tasks").insert({
    member_id: memberId,
    title,
    detail: detail || null,
    position: nextPosition,
  });

  if (error) return { error: "Konnte nicht speichern: " + error.message };

  revalidatePath("/coach");
  revalidatePath("/dashboard");
  return { success: true };
}

// Coach verschiebt eine Station in der Roadmap nach oben/unten.
export async function moveTask(id: string, direction: "up" | "down") {
  if (!supabaseConfigured) return;
  const supabase = await createClient();

  // Die zu verschiebende Aufgabe laden.
  const { data: current } = await supabase
    .from("tasks")
    .select("id, member_id, position")
    .eq("id", id)
    .single();
  if (!current) return;

  // Den direkten Nachbarn in Bewegungsrichtung finden.
  const { data: neighbor } = await supabase
    .from("tasks")
    .select("id, position")
    .eq("member_id", current.member_id)
    .order("position", { ascending: direction === "down" })
    .filter(
      "position",
      direction === "up" ? "lt" : "gt",
      current.position,
    )
    .limit(1)
    .maybeSingle();
  if (!neighbor) return; // schon ganz oben bzw. unten

  // Positionen tauschen.
  await supabase
    .from("tasks")
    .update({ position: neighbor.position })
    .eq("id", current.id);
  await supabase
    .from("tasks")
    .update({ position: current.position })
    .eq("id", neighbor.id);

  revalidatePath("/coach");
  revalidatePath("/dashboard");
}

// Coach löscht eine Aufgabe wieder.
export async function deleteTask(id: string) {
  if (!supabaseConfigured) return;
  const supabase = await createClient();
  await supabase.from("tasks").delete().eq("id", id);
  revalidatePath("/coach");
  revalidatePath("/dashboard");
}
