// Solange keine echten Supabase-Keys gesetzt sind, läuft die App im Demo-Modus:
// Seiten sind frei zugänglich, Login zeigt einen Hinweis statt echter Auth.
export const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
