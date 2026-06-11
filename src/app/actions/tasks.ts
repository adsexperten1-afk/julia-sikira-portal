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
  const { error } = await supabase.from("tasks").insert({
    member_id: memberId,
    title,
    detail: detail || null,
  });

  if (error) return { error: "Konnte nicht speichern: " + error.message };

  revalidatePath("/coach");
  revalidatePath("/dashboard");
  return { success: true };
}

// Coach löscht eine Aufgabe wieder.
export async function deleteTask(id: string) {
  if (!supabaseConfigured) return;
  const supabase = await createClient();
  await supabase.from("tasks").delete().eq("id", id);
  revalidatePath("/coach");
  revalidatePath("/dashboard");
}
