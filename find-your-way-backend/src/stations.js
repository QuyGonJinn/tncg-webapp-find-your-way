// Passive stations have a 'code' that teams must enter
// Active stations require admin approval (no code)
const STATIONS = [
  { id: 1,  title: "Holymoji",                type: "passiv", points: 20, emoji: "😇", code: "HM42", location: "Im Gemeindesaal an der Wand" },
  { id: 2,  title: "Geoguesser",              type: "passiv", points: 20, emoji: "🌍", code: "GG17", location: "Im Klassenzimmer auf dem Tisch" },
  { id: 3,  title: "Fake or Fact",            type: "aktiv",  points: 50, emoji: "🤔", code: null, location: "Beim Betreuer im Klassenzimmer" },
  { id: 4,  title: "David und Goliath",       type: "aktiv",  points: 50, emoji: "🪨", code: null, location: "Im Hof beim Eimer" },
  { id: 5,  title: "Anchor of Hope",          type: "passiv", points: 20, emoji: "⚓", code: "AH85", location: "Im Flur unter der Treppe" },
  { id: 6,  title: "Krüge von Kana",          type: "aktiv",  points: 50, emoji: "🏺", code: null, location: "Beim Betreuer im Garten" },
  { id: 7,  title: "Lochkarte",               type: "passiv", points: 20, emoji: "🃏", code: "LK63", location: "Im Büro auf dem Schreibtisch" },
  { id: 8,  title: "Heilige Buchstabenjagd",  type: "passiv", points: 20, emoji: "🔤", code: "BJ29", location: "Im Garten versteckt an verschiedenen Orten" },
  { id: 9,  title: "Glaubenssprung",          type: "aktiv",  points: 50, emoji: "🙏", code: null, location: "Beim Betreuer auf der Plattform" },
  { id: 10, title: "Der Gute Hirte",          type: "aktiv",  points: 50, emoji: "🐑", code: null, location: "Beim Betreuer im Parcours" },
  { id: 11, title: "Wer bin Ich / Standbild", type: "passiv", points: 20, emoji: "🗿", code: "WI54", location: "Im Foyer vor der Bühne" },
  { id: 12, title: "Kennst du mich",          type: "passiv", points: 20, emoji: "❤️", code: "KM91", location: "Im Gemeindesaal am Tisch" },
];

module.exports = STATIONS;
