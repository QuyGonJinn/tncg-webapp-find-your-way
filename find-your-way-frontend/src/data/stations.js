// Stations data - uses i18n for translations
// Import this and use with useI18n hook to get translated content

export const STATIONS_DATA = [
  { id: 1,  titleKey: "stations.holymoji.title",                descriptionKey: "stations.holymoji.description", type: "passiv", points: 20, emoji: "😇", code: "HM42", instructionsKey: "stations.holymoji.instructions" },
  { id: 2,  titleKey: "stations.geoguesser.title",              descriptionKey: "stations.geoguesser.description", type: "passiv", points: 20, emoji: "🌍", code: "GG17", instructionsKey: "stations.geoguesser.instructions" },
  { id: 3,  titleKey: "stations.fakeOrFact.title",              descriptionKey: "stations.fakeOrFact.description", type: "aktiv",  points: 50, emoji: "🤔", code: null, instructionsKey: "stations.fakeOrFact.instructions" },
  { id: 4,  titleKey: "stations.davidAndGoliath.title",         descriptionKey: "stations.davidAndGoliath.description", type: "aktiv",  points: 50, emoji: "🪨", code: null, instructionsKey: "stations.davidAndGoliath.instructions" },
  { id: 5,  titleKey: "stations.anchorOfHope.title",            descriptionKey: "stations.anchorOfHope.description", type: "passiv", points: 20, emoji: "⚓", code: "AH85", instructionsKey: "stations.anchorOfHope.instructions" },
  { id: 6,  titleKey: "stations.krugeOfKana.title",             descriptionKey: "stations.krugeOfKana.description", type: "aktiv",  points: 50, emoji: "🏺", code: null, instructionsKey: "stations.krugeOfKana.instructions" },
  { id: 7,  titleKey: "stations.versteckteBotschaft.title",     descriptionKey: "stations.versteckteBotschaft.description", type: "passiv", points: 20, emoji: "🃏", code: "LK63", instructionsKey: "stations.versteckteBotschaft.instructions" },
  { id: 8,  titleKey: "stations.heiligeBuchstabenjagd.title",   descriptionKey: "stations.heiligeBuchstabenjagd.description", type: "passiv", points: 20, emoji: "🔤", code: "BJ29", instructionsKey: "stations.heiligeBuchstabenjagd.instructions" },
  { id: 9,  titleKey: "stations.glaubenssprung.title",          descriptionKey: "stations.glaubenssprung.description", type: "aktiv",  points: 50, emoji: "🙏", code: null, instructionsKey: "stations.glaubenssprung.instructions" },
  { id: 10, titleKey: "stations.guterHirte.title",              descriptionKey: "stations.guterHirte.description", type: "aktiv",  points: 50, emoji: "🐑", code: null, instructionsKey: "stations.guterHirte.instructions" },
  { id: 11, titleKey: "stations.werBinIch.title",               descriptionKey: "stations.werBinIch.description", type: "passiv", points: 20, emoji: "🗿", code: "WI54", instructionsKey: "stations.werBinIch.instructions" },
  { id: 12, titleKey: "stations.spellingBee.title",             descriptionKey: "stations.spellingBee.description", type: "passiv", points: 20, emoji: "🐝", code: "12345", instructionsKey: "stations.spellingBee.instructions" },
];

// Helper function to get translated stations
export function getStations(t) {
  return STATIONS_DATA.map(station => ({
    ...station,
    title: t(station.titleKey),
    description: t(station.descriptionKey),
    instructions: t(station.instructionsKey),
  }));
}

export const TEAM_ICONS = [
  "✝️", "🙏", "🕊️", "⚓", "🔥", "🌊",
  "🦁", "🦅", "🐑", "🐬", "🦋", "🌿",
  "⭐", "🌈", "🛡️", "🗝️", "📖", "🕯️",
];

export const GAME_DURATION = 2 * 60 * 60; // 2 hours in seconds

// For backwards compatibility, export STATIONS with default German translations
import de from '../i18n/de.json';

function getDefaultT(key) {
  const keys = key.split('.');
  let value = de;
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return key;
    }
  }
  return value || key;
}

export const STATIONS = STATIONS_DATA.map(station => ({
  ...station,
  title: getDefaultT(station.titleKey),
  description: getDefaultT(station.descriptionKey),
  instructions: getDefaultT(station.instructionsKey),
}));
