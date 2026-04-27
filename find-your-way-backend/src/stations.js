// Passive stations have a 'code' that teams must enter
// Active stations require admin approval (no code)
const STATIONS = [
  { id: 1,  title: "Holymoji",                type: "passiv", points: 20, emoji: "😇", code: "HM42" },
  { id: 2,  title: "Geoguesser",              type: "passiv", points: 20, emoji: "🌍", code: "GG17" },
  { id: 3,  title: "Fake or Fact",            type: "aktiv",  points: 50, emoji: "🤔", code: null },
  { id: 4,  title: "David und Goliath",       type: "aktiv",  points: 50, emoji: "🪨", code: null },
  { id: 5,  title: "Anchor of Hope",          type: "passiv", points: 20, emoji: "⚓", code: "AH85" },
  { id: 6,  title: "Krüge von Kana",          type: "aktiv",  points: 50, emoji: "🏺", code: null },
  { id: 7,  title: "Lochkarte",               type: "passiv", points: 20, emoji: "🃏", code: "LK63" },
  { id: 8,  title: "Heilige Buchstabenjagd",  type: "passiv", points: 20, emoji: "🔤", code: "BJ29" },
  { id: 9,  title: "Glaubenssprung",          type: "aktiv",  points: 50, emoji: "🙏", code: null },
  { id: 10, title: "Der Gute Hirte",          type: "aktiv",  points: 50, emoji: "🐑", code: null },
  { id: 11, title: "Wer bin Ich / Standbild", type: "passiv", points: 20, emoji: "🗿", code: "WI54" },
  { id: 12, title: "Kennst du mich",          type: "passiv", points: 20, emoji: "❤️", code: "KM91" },
];

module.exports = STATIONS;
