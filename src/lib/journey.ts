// Echte Coaching-Inhalte für das Portal. Start-Inhalte von guter fachlicher
// Qualität – Julia kann sie jederzeit anpassen oder ersetzen.
// (Später kommen diese Daten pro Teilnehmer aus Supabase.)

export const heroFirstName = "Max";

// ---- Aufgaben der Woche (echtes Homework) ------------------------------

export type Task = {
  id: string; // stabile ID – wird zum Speichern des Abhak-Status genutzt
  title: string;
  detail: string;
};

export const weeklyTasks: Task[] = [
  {
    id: "profil-text",
    title: "Profiltext nach dem Leitfaden überarbeiten",
    detail:
      "Kein Lebenslauf – zeig Charakter. Eine Sache, die dich begeistert, eine, die dich ausmacht, und eine kleine Einladung zum Gespräch.",
  },
  {
    id: "fotos",
    title: "3 ehrliche Fotos auswählen",
    detail:
      "Ein klares Gesicht (Lächeln, guter Lichteinfall), ein Ganzkörperbild, ein Foto „in Aktion“ – beim Hobby, unterwegs, mit echtem Ausdruck.",
  },
  {
    id: "anschreiben",
    title: "5 Frauen mit einer echten, profilbezogenen Nachricht anschreiben",
    detail:
      "Beziehe dich auf etwas Konkretes aus ihrem Profil. Keine Standard-Sprüche. Eine lockere Frage am Ende, die ihr leichtfällt zu beantworten.",
  },
  {
    id: "treffen-vorschlag",
    title: "Ein gutes Gespräch in einen Treffen-Vorschlag überführen",
    detail:
      "Wenn der Draht stimmt: nicht ewig schreiben. Schlag konkret etwas Lockeres vor (Spaziergang, Kaffee) mit zwei Zeitoptionen.",
  },
  {
    id: "mindset",
    title: "10 Minuten Mindset: deine Stärken aufschreiben",
    detail:
      "Schreib 5 Dinge auf, die dich als Mann ausmachen und auf die du stolz bist. Souveränität kommt von innen – das ist dein Fundament.",
  },
  {
    id: "absage-reflexion",
    title: "Eine Absage bewusst abschütteln",
    detail:
      "Falls eine Absage kam: Halt im Logbuch fest, was du daraus lernst. Eine Absage ist kein Urteil über dich – nur ein „passt nicht“.",
  },
];

// ---- Julias Werkzeugkasten: Methode in Modulen -------------------------

export type ModuleSection = {
  heading: string;
  body: string;
  bullets?: string[];
};

export type Module = {
  id: string;
  icon: string;
  title: string;
  summary: string;
  readMinutes: number;
  sections: ModuleSection[];
};

export const modules: Module[] = [
  {
    id: "profil",
    icon: "📸",
    title: "Dein Profil, das wirkt",
    summary:
      "Wie du in Sekunden sympathisch und interessant rüberkommst – ohne Angeberei.",
    readMinutes: 4,
    sections: [
      {
        heading: "Die Fotos entscheiden zuerst",
        body: "Bevor jemand ein Wort liest, wirken deine Bilder. Ziel ist nicht „perfekt“, sondern echt und nahbar.",
        bullets: [
          "Hauptbild: klares Gesicht, ehrliches Lächeln, gutes (am besten Tages-)Licht.",
          "Ein Ganzkörperbild – Ehrlichkeit schafft Vertrauen.",
          "Ein Foto „in Aktion“: Hobby, Reise, mit Freunden – zeigt dein Leben.",
          "Weglassen: Spiegel-Selfies, Sonnenbrille auf jedem Bild, Gruppenfotos als Hauptbild, Auto/Filter-Übertreibung.",
        ],
      },
      {
        heading: "Der Text: Charakter statt Checkliste",
        body: "Niemand verliebt sich in eine Aufzählung von Eigenschaften. Zeig, wie es ist, mit dir Zeit zu verbringen.",
        bullets: [
          "Eine Sache, die dich begeistert (und warum).",
          "Eine kleine, ehrliche Eigenheit – das macht dich menschlich.",
          "Eine Einladung zum Gespräch (eine Frage oder ein Aufhänger).",
        ],
      },
    ],
  },
  {
    id: "erste-nachricht",
    icon: "💬",
    title: "Die erste Nachricht",
    summary:
      "So startest du Gespräche, die nicht im Nichts versanden – persönlich statt 08/15.",
    readMinutes: 3,
    sections: [
      {
        heading: "Beziehe dich auf SIE",
        body: "Die beste Nachricht zeigt, dass du ihr Profil wirklich angesehen hast. Das hebt dich sofort von 90 % der anderen ab.",
        bullets: [
          "Greif ein Detail auf: ein Foto, ein Hobby, ein Satz aus ihrer Bio.",
          "Stell eine offene Frage – keine, die man mit „ja/nein“ abwürgt.",
          "Halt es kurz. Zwei, drei Sätze reichen für den Anfang.",
        ],
      },
      {
        heading: "Beispiel statt Theorie",
        body: "Schlecht: „Hey, wie geht’s?“ — Besser: „Auf deinem dritten Foto bist du beim Wandern – sieht nach Dolomiten aus? Ich such gerade eine neue Tour für den Sommer, hast du einen Geheimtipp?“",
      },
    ],
  },
  {
    id: "gespraech",
    icon: "🔥",
    title: "Gespräche, die Spannung halten",
    summary:
      "Vom netten Smalltalk zu echtem Interesse – und rechtzeitig ins echte Leben.",
    readMinutes: 4,
    sections: [
      {
        heading: "Fragen UND von dir erzählen",
        body: "Ein Verhör ist langweilig, ein Monolog auch. Die Mischung macht’s: Frag etwas, und teil dann auch etwas von dir.",
        bullets: [
          "Auf eine Antwort eingehen, statt direkt die nächste Frage zu feuern.",
          "Kleine Geschichten statt Fakten – Emotion bleibt hängen.",
          "Humor und ein bisschen spielerisches Necken schaffen Nähe.",
        ],
      },
      {
        heading: "Nicht ewig chatten",
        body: "Der Chat ist die Brücke, nicht das Ziel. Wenn der Draht stimmt, schlag ein Treffen vor – sonst verliert sich die Energie.",
      },
    ],
  },
  {
    id: "date",
    icon: "⚔️",
    title: "Das erste Date",
    summary:
      "Souverän statt nervös – mit der richtigen Vorbereitung wird es leicht.",
    readMinutes: 4,
    sections: [
      {
        heading: "Ort & Rahmen",
        body: "Wähl etwas Lockeres, wo Reden leichtfällt und ihr in Bewegung sein könnt.",
        bullets: [
          "Spaziergang, Café, ein kleiner Markt – kein steifes Dinner als erstes Date.",
          "Plan B im Kopf: ein zweiter Ort in der Nähe, falls es gut läuft.",
        ],
      },
      {
        heading: "Dein Mindset",
        body: "Geh mit Neugier rein, nicht mit Prüfungsangst. Du checkst auch, ob SIE zu dir passt. Das nimmt den Druck und macht dich attraktiv.",
        bullets: [
          "Echtes Zuhören schlägt jeden auswendig gelernten Spruch.",
          "Handy weg, Blickkontakt, präsent sein.",
          "Am Ende ehrlich: Wenn es schön war, sag es und schlag ein Wiedersehen vor.",
        ],
      },
    ],
  },
  {
    id: "mindset",
    icon: "🛡️",
    title: "Mindset & Souveränität",
    summary:
      "Echte Selbstsicherheit kommt von innen – das ist das Fundament für alles.",
    readMinutes: 3,
    sections: [
      {
        heading: "Selbstwert ist nicht verhandelbar",
        body: "Deine Stimmung darf nicht an einem Match oder einer Antwort hängen. Je stabiler du in dir ruhst, desto anziehender wirkst du.",
        bullets: [
          "Erinnere dich regelmäßig an deine Stärken (siehe Mindset-Aufgabe).",
          "Eine Absage ist Statistik, kein Urteil. Weitermachen ist die Antwort.",
        ],
      },
      {
        heading: "Abundance statt Mangel",
        body: "Wer aus der Haltung „es gibt genug Möglichkeiten“ handelt, klammert nicht und bleibt entspannt. Das spürt jede Frau sofort.",
      },
    ],
  },
];

// ---- Kopier-Vorlagen ---------------------------------------------------

export type Template = {
  id: string;
  category: string;
  title: string;
  text: string;
};

export const templates: Template[] = [
  {
    id: "opener-hobby",
    category: "Opener",
    title: "Profilbezogener Einstieg (Hobby)",
    text: "Auf deinem [X]-Foto siehst du aus, als wärst du [Aktivität] richtig in deinem Element. Wie bist du dazu gekommen?",
  },
  {
    id: "opener-detail",
    category: "Opener",
    title: "Auf ein Detail eingehen",
    text: "„[Zitat aus ihrer Bio]“ – das hat mich neugierig gemacht. Erzähl mal, wie meinst du das genau?",
  },
  {
    id: "opener-humor",
    category: "Opener",
    title: "Locker & spielerisch",
    text: "Okay, wichtige Frage gleich zu Beginn: [bezieht sich auf ihr Profil, z. B. „Team Berge oder Team Meer?“]. Davon hängt alles ab. 😄",
  },
  {
    id: "profil-baustein",
    category: "Profiltext",
    title: "Profiltext-Gerüst",
    text: "Das begeistert mich: [eine Sache + warum].\nDas macht mich aus: [eine ehrliche Eigenheit].\nWorauf ich mich freue: [Einladung zum Gespräch / gemeinsame Aktivität].",
  },
  {
    id: "date-vorschlag",
    category: "Treffen",
    title: "Treffen vorschlagen (konkret)",
    text: "Ich finde, wir sollten das hier aus dem Chat holen. 😊 Lust auf einen entspannten [Kaffee/Spaziergang] diese Woche? Bei mir würde [Tag] oder [Tag] passen.",
  },
  {
    id: "date-ideen",
    category: "Treffen",
    title: "Date-Ideen (locker)",
    text: "Spaziergang am Wasser · Kaffee + kleiner Stadtbummel · Wochenmarkt · Eis essen & schlendern · gemeinsam etwas Kleines ausprobieren (Minigolf, Ausstellung).",
  },
];

// ---- Logbuch-Typen (Reflexion) -----------------------------------------

export const LOGBOOK_TYPES = [
  "Gespräch",
  "Date",
  "Erfolg",
  "Reflexion",
] as const;

export type LogbookType = (typeof LOGBOOK_TYPES)[number];

export type LogEntry = {
  id: string;
  date: string; // ISO-String
  type: LogbookType;
  text: string;
};
