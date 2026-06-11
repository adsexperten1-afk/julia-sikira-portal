import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// In Next.js 16 ist cookies() asynchron – daher await.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Wird aus Server Components ohne Schreibzugriff aufgerufen –
            // das Auffrischen der Session übernimmt dann proxy.ts.
          }
        },
      },
    },
  );
}
