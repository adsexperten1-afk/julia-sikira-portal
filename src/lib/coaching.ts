// Demo-Inhalte für die gamifizierte Heldenreise. Später kommen diese Daten
// pro Held aus Supabase – die Struktur bleibt gleich.

export const heroFirstName = "Max";

// ---- Held / Spielstand -------------------------------------------------

export type Hero = {
  name: string;
  rank: string;
  level: number;
  xp: number; // aktuelle XP in diesem Level
  xpForNext: number; // XP bis zum nächsten Level
  streakDays: number; // Tage in Folge aktiv
};

export const hero: Hero = {
  name: heroFirstName,
  rank: "Herausforderer",
  level: 4,
  xp: 320,
  xpForNext: 500,
  streakDays: 6,
};

// Rang-Leiter (wächst mit dem Level)
export const ranks = [
  "Anwärter",
  "Herausforderer",
  "Stratege",
  "Charismatiker",
  "Meister",
];

// ---- Etappen der Heldenreise (Quest-Map) -------------------------------

export type StageStatus = "done" | "current" | "locked";

export type Stage = {
  chapter: string; // z.B. "Etappe 1"
  title: string;
  subtitle: string;
  status: StageStatus;
  xpReward: number;
  isBoss?: boolean; // große Herausforderung
};

export const stages: Stage[] = [
  {
    chapter: "Der Ruf",
    title: "Die Entscheidung",
    subtitle: "Du sagst Ja zu deiner Veränderung.",
    status: "done",
    xpReward: 50,
  },
  {
    chapter: "Aufbruch",
    title: "Dein Fundament",
    subtitle: "Selbstbild, Ziele, innere Stärke.",
    status: "done",
    xpReward: 100,
  },
  {
    chapter: "Aufbruch",
    title: "Deine Ausstrahlung",
    subtitle: "Auftreten, Profil, erster Eindruck.",
    status: "current",
    xpReward: 120,
  },
  {
    chapter: "Die Prüfungen",
    title: "Das erste Date",
    subtitle: "Souverän ins Gespräch – deine erste Bewährung.",
    status: "locked",
    xpReward: 200,
    isBoss: true,
  },
  {
    chapter: "Die Verwandlung",
    title: "Der neue Du",
    subtitle: "Selbstsicher, klar, magnetisch.",
    status: "locked",
    xpReward: 250,
  },
  {
    chapter: "Die Heimkehr",
    title: "Echte Verbindung",
    subtitle: "Aus Funken wird Beziehung.",
    status: "locked",
    xpReward: 300,
    isBoss: true,
  },
];

// ---- Mission der Woche (der eine nächste Schritt) ----------------------

export type Mission = {
  label: string;
  title: string;
  description: string;
  xpReward: number;
  mentorBriefing: string;
};

export const weeklyMission: Mission = {
  label: "Mission der Woche",
  title: "Schreib dein Profil neu",
  description:
    "Überarbeite deinen Bio-Text nach dem Leitfaden. Klar, ehrlich, mit Persönlichkeit – kein Lebenslauf.",
  xpReward: 80,
  mentorBriefing:
    "Dein Profil ist dein erster Auftritt, Held. Zeig Charakter statt Checkliste – ich glaube an dich.",
};

// ---- Abzeichen / Trophäen ---------------------------------------------

export type Badge = {
  icon: string;
  label: string;
  unlocked: boolean;
};

export const badges: Badge[] = [
  { icon: "🔥", label: "7-Tage-Streak", unlocked: false },
  { icon: "🎯", label: "Profil gemeistert", unlocked: true },
  { icon: "💬", label: "Erstes Gespräch", unlocked: true },
  { icon: "🛡️", label: "Erste Absage weggesteckt", unlocked: false },
  { icon: "⚔️", label: "Erstes Date", unlocked: false },
  { icon: "👑", label: "Beziehung gestartet", unlocked: false },
];

// ---- Helfer ------------------------------------------------------------

export function stagesProgress(): number {
  const done = stages.filter((s) => s.status === "done").length;
  return Math.round((done / stages.length) * 100);
}

export function xpPercent(): number {
  return Math.round((hero.xp / hero.xpForNext) * 100);
}
