# Einrichtung – Julia Sikira Kundenportal

Diese Anleitung führt dich Schritt für Schritt durch alles, was nötig ist, damit
aus dem Demo-Modus ein echtes Portal mit Login pro Kundin wird – live unter
`mein.julia-sikira.de`.

Du brauchst kein Vorwissen. Folge einfach den Schritten der Reihe nach.

---

## Schritt 1 – Supabase-Konto & Projekt anlegen (~5 Min)

Supabase ist unsere Datenbank + Login-System (kostenlos im Start).

1. Gehe auf **https://supabase.com** und klicke oben rechts auf **Start your project**.
2. Melde dich mit GitHub oder E-Mail an.
3. Klicke auf **New project**.
   - **Name:** `julia-sikira-portal`
   - **Database Password:** ein starkes Passwort wählen → **gut abspeichern** (Passwortmanager).
   - **Region:** `Central EU (Frankfurt)` (nah an Deutschland, DSGVO-freundlich).
4. **Create new project** klicken. Das Anlegen dauert 1–2 Minuten.

---

## Schritt 2 – Die zwei Schlüssel kopieren (~2 Min)

1. Im Supabase-Projekt links auf das Zahnrad **Project Settings** klicken.
2. Auf **API Keys** (bzw. **API**) gehen.
3. Du brauchst genau zwei Werte:
   - **Project URL** (sieht aus wie `https://abcd1234.supabase.co`)
   - **anon public** Key (langer Text, beginnt oft mit `eyJ...`)

Diese beiden Werte trägst du jetzt in die Datei **`.env.local`** im Projekt ein:

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcd1234.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...dein-langer-key
```

> Wichtig: Der **anon public** Key ist für die Nutzung im Browser gedacht und
> sicher. Den **service_role** Key NIEMALS in `.env.local` oder ins Frontend!

Danach den Dev-Server **einmal neu starten** (im Terminal `Strg+C`, dann
`npm run dev`), damit die neuen Werte geladen werden. Der Demo-Hinweis im
Dashboard verschwindet dann und der echte Login ist aktiv.

---

## Schritt 3 – Erste Kundin anlegen (~2 Min)

Solange es noch keine Self-Service-Registrierung gibt, legst du Logins selbst an:

1. In Supabase links auf **Authentication** → **Users**.
2. **Add user** → **Create new user**.
3. E-Mail + Passwort der Kundin eintragen, **Auto Confirm User** aktivieren.
4. Diese Zugangsdaten gibst du der Kundin – sie kann sich sofort einloggen.

(Optional, später: E-Mail-Einladungen, Passwort-zurücksetzen, Selbstregistrierung.)

---

## Schritt 4 – Code zu GitHub bringen (~5 Min)

Damit Vercel deployen kann, muss der Code in einem GitHub-Repository liegen.

1. Konto auf **https://github.com** anlegen (falls noch keins).
2. **New repository** → Name `julia-sikira-portal`, **Private** wählen, **Create**.
3. Im Projektordner im Terminal (GitHub zeigt dir die exakten Befehle):

```bash
git add .
git commit -m "Phase 1: Login + Dashboard"
git branch -M main
git remote add origin https://github.com/DEIN-NAME/julia-sikira-portal.git
git push -u origin main
```

---

## Schritt 5 – Bei Vercel deployen (~5 Min)

Vercel macht die App im Internet erreichbar (kostenlos im Start).

1. Auf **https://vercel.com** mit GitHub anmelden.
2. **Add New… → Project** → das Repo `julia-sikira-portal` importieren.
3. Bei **Environment Variables** die zwei Supabase-Werte aus Schritt 2 eintragen:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Deploy** klicken. Nach ~1 Minute ist die App unter einer
   `…vercel.app`-Adresse live.

---

## Schritt 6 – Subdomain `mein.julia-sikira.de` verbinden (~10 Min)

1. In Vercel im Projekt: **Settings → Domains**.
2. `mein.julia-sikira.de` eingeben → **Add**.
3. Vercel zeigt dir einen **CNAME**-Eintrag, z. B.:
   - **Name/Host:** `mein`
   - **Wert/Ziel:** `cname.vercel-dns.com`
4. Diesen CNAME im DNS deines Domain-Anbieters (wo `julia-sikira.de` verwaltet
   wird, z. B. IONOS, Strato, GoDaddy) eintragen.
5. Nach kurzer Wartezeit (Minuten bis ~1 Std.) ist das Portal unter
   **https://mein.julia-sikira.de** erreichbar – inkl. automatischem SSL.

> Wichtig: Trage die Domain nach dem Verbinden auch in Supabase unter
> **Authentication → URL Configuration** als **Site URL** /
> **Redirect URL** ein, damit der Login dort sauber funktioniert.

---

## Schritt 7 – KI-Wingman aktivieren (Anthropic-API-Key) (~5 Min)

Der **KI-Wingman „Leo"** ist der 24/7-Chat-Coach im Portal. Er läuft schon
jetzt im **Demo-Modus** mit Beispiel-Antworten – ohne dass du etwas tun musst.
Damit er ein echter, mitdenkender Coach wird, brauchst du einen API-Schlüssel
von Anthropic (der Firma hinter Claude).

> Kosten: Anthropic rechnet nach Nutzung ab (Pay-as-you-go). Für ein paar
> Coaching-Chats sind das wenige Cent. Du lädst einmal ein kleines Guthaben auf
> (z. B. 5 $) und behältst die volle Kontrolle.

**So bekommst du den Schlüssel:**

1. Gehe auf **https://console.anthropic.com** und erstelle ein Konto
   (E-Mail bestätigen, einloggen).
2. Lege ein kleines Guthaben an: oben/links **Billing** (oder **Plans & Billing**)
   → **Add credits** → z. B. 5 $ per Kreditkarte aufladen.
3. Gehe zu **API Keys** (im Menü links unter Settings).
4. Klicke **Create Key**, gib ihm einen Namen (z. B. `julia-portal-wingman`)
   und **kopiere den Schlüssel sofort** – er beginnt mit `sk-ant-...` und wird
   nur **einmal** vollständig angezeigt.
5. Trage ihn in die Datei **`.env.local`** ein – eine neue Zeile dazu:

```env
ANTHROPIC_API_KEY=sk-ant-...dein-langer-key
```

6. Dev-Server neu starten (`Strg+C`, dann `npm run dev`). Der Wingman antwortet
   ab jetzt live und individuell.

7. **Für die Live-Seite (Vercel):** Denselben Wert auch in Vercel hinterlegen –
   **Settings → Environment Variables** → `ANTHROPIC_API_KEY` hinzufügen und neu
   deployen.

> Sicherheit: Der `ANTHROPIC_API_KEY` ist ein **geheimer** Schlüssel. Er steht
> nur in `.env.local` bzw. in den Vercel-Variablen – **niemals** im Code, im
> Frontend oder auf GitHub. `.env.local` ist bereits per `.gitignore`
> ausgeschlossen. Wenn ein Schlüssel je versehentlich öffentlich wird: in der
> Anthropic-Console löschen („Revoke") und neu erstellen.

---

## Geschafft 🎉

Damit läuft Phase 1 produktiv. Sag Bescheid, wenn du startklar bist für:

- **Phase 2:** Meilensteine & Aufgaben aus echten Daten (Supabase-Tabellen) statt Demo-Inhalten
- **Phase 3:** Automatisches Freischalten von Phasen + Erinnerungen
- **Phase 4:** Check-ins & Chat zwischen den Sessions
