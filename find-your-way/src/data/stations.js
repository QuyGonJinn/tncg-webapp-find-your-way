export const STATIONS = [
  { id: 1,  title: "Holymoji",                description: "Erratet biblische Begriffe und Geschichten – nur mit Emojis dargestellt.", type: "passiv", points: 20, emoji: "😇", code: "HM42", instructions: "Schaut euch die Emoji-Reihen an und erratet, welche biblische Geschichte oder welcher Begriff gemeint ist. Ihr habt 5 Minuten Zeit. Findet mindestens 8 von 10 richtig, um den Code zu erhalten." },
  { id: 2,  title: "Geoguesser",              description: "Erkennt anhand von Bildern, wo auf der Welt diese biblischen Orte liegen.", type: "passiv", points: 20, emoji: "🌍", code: "GG17", instructions: "Euch werden 6 Bilder von biblischen Orten gezeigt. Ordnet sie den richtigen Ländern/Regionen zu. Mindestens 5 richtig = Code!" },
  { id: 3,  title: "Fake or Fact",            description: "Wahr oder falsch? Bewertet gemeinsam verrückte Aussagen über die Bibel.", type: "aktiv",  points: 50, emoji: "🤔", code: null, instructions: "Der Betreuer liest euch 10 Aussagen vor. Entscheidet als Team: Wahr oder Falsch? Mindestens 7 richtig = Bestätigung!" },
  { id: 4,  title: "David und Goliath",       description: "Stellt euch der Herausforderung: Klein gegen Groß – wer hat den Mut?", type: "aktiv",  points: 50, emoji: "🪨", code: null, instructions: "Ein Teamkollege (David) muss 3 Bälle in einen Eimer werfen, der 5 Meter entfernt ist. Mindestens 2 Treffer = Bestätigung!" },
  { id: 5,  title: "Anchor of Hope",          description: "Findet den versteckten Anker und entschlüsselt die Botschaft der Hoffnung.", type: "passiv", points: 20, emoji: "⚓", code: "AH85", instructions: "Sucht an dieser Station nach einem versteckten Anker. Wenn ihr ihn findet, könnt ihr die Botschaft darunter lesen und den Code erhalten." },
  { id: 6,  title: "Krüge von Kana",          description: "Füllt gemeinsam die Krüge – eine Aufgabe, die Teamwork und Glauben braucht.", type: "aktiv",  points: 50, emoji: "🏺", code: null, instructions: "Ihr habt 3 Krüge und müsst sie mit Wasser füllen – aber nur mit Teamwork! Der Betreuer erklärt die genaue Aufgabe vor Ort." },
  { id: 7,  title: "Lochkarte",               description: "Haltet die Lochkarte ins Licht und lest die verborgene Botschaft.", type: "passiv", points: 20, emoji: "🃏", code: "LK63", instructions: "Nehmt die Lochkarte und haltet sie gegen das Licht. Die Löcher zeigen euch Buchstaben – setzt sie zusammen und erhaltet den Code." },
  { id: 8,  title: "Heilige Buchstabenjagd",  description: "Sucht versteckte Buchstaben und setzt sie zum richtigen Bibelvers zusammen.", type: "passiv", points: 20, emoji: "🔤", code: "BJ29", instructions: "An dieser Station sind Buchstaben versteckt. Findet alle 8 Buchstaben und setzt sie zum richtigen Bibelvers zusammen. Der Code ist das Lösungswort!" },
  { id: 9,  title: "Glaubenssprung",          description: "Vertraut einander blind – ein Teammitglied springt, die anderen fangen.", type: "aktiv",  points: 50, emoji: "🙏", code: null, instructions: "Ein Teamkollege wird verbunden und springt von einer 1m hohen Plattform. Die anderen müssen ihn fangen. Sicher landen = Bestätigung!" },
  { id: 10, title: "Der Gute Hirte",          description: "Führt euer 'Schaf' (verbundene Augen) sicher durch den Parcours.", type: "aktiv",  points: 50, emoji: "🐑", code: null, instructions: "Ein Teamkollege hat verbundene Augen (das Schaf). Die anderen führen ihn nur mit Stimme durch einen Parcours. Ziel erreicht = Bestätigung!" },
  { id: 11, title: "Wer bin Ich / Standbild", description: "Stellt eine biblische Person als Standbild dar – die anderen raten, wer gemeint ist.", type: "passiv", points: 20, emoji: "🗿", code: "WI54", instructions: "Euer Team stellt eine biblische Person als Standbild dar (keine Worte!). Der Betreuer rät – wenn er es richtig errät, bekommt ihr den Code." },
  { id: 12, title: "Kennst du mich",          description: "Wie gut kennt ihr euch? Beantwortet Fragen übereinander und sammelt Punkte.", type: "passiv", points: 20, emoji: "❤️", code: "KM91", instructions: "Jedes Teamkollege beantwortet 3 Fragen über die anderen. Mindestens 6 von 9 richtig = Code!" },
];

export const TEAM_ICONS = [
  "✝️", "🙏", "🕊️", "⚓", "🔥", "🌊",
  "🦁", "🦅", "🐑", "🐬", "🦋", "🌿",
  "⭐", "🌈", "🛡️", "🗝️", "📖", "🕯️",
];

export const GAME_DURATION = 2 * 60 * 60; // 2 hours in seconds
