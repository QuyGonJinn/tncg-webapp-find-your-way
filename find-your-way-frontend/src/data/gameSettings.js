// Spieleinstellungen - können im Admin-Bereich geändert werden
export const DEFAULT_GAME_SETTINGS = {
  gameDuration: 120, // Spieldauer in Minuten
  reminderInterval: 15, // Reminder alle X Minuten
};

// Einstellungen aus localStorage laden
export function loadGameSettings() {
  const stored = localStorage.getItem('fyw_game_settings');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_GAME_SETTINGS;
    }
  }
  return DEFAULT_GAME_SETTINGS;
}

// Einstellungen speichern
export function saveGameSettings(settings) {
  localStorage.setItem('fyw_game_settings', JSON.stringify(settings));
}
