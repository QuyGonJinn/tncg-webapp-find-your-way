import { useState, useEffect } from 'react';
import { loadGameSettings, saveGameSettings, DEFAULT_GAME_SETTINGS } from '../../data/gameSettings';

export default function AdminSettings() {
  const [settings, setSettings] = useState(DEFAULT_GAME_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(loadGameSettings());
  }, []);

  function handleSave() {
    saveGameSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    setSettings(DEFAULT_GAME_SETTINGS);
    saveGameSettings(DEFAULT_GAME_SETTINGS);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-blue-700 font-black text-lg mb-4">⚙️ Spieleinstellungen</h2>

      <div className="space-y-4">
        {/* Game Duration */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            ⏱️ Spieldauer (Minuten)
          </label>
          <input
            type="number"
            min="1"
            max="480"
            value={settings.gameDuration}
            onChange={(e) => setSettings({ ...settings, gameDuration: parseInt(e.target.value) || 1 })}
            className="w-full border-2 border-blue-200 rounded-xl px-4 py-2 text-lg font-bold focus:outline-none focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Wie lange dauert das Spiel insgesamt?</p>
        </div>

        {/* Reminder Interval */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            🔔 Reminder-Intervall (Minuten)
          </label>
          <input
            type="number"
            min="1"
            max="60"
            value={settings.reminderInterval}
            onChange={(e) => setSettings({ ...settings, reminderInterval: parseInt(e.target.value) || 1 })}
            className="w-full border-2 border-blue-200 rounded-xl px-4 py-2 text-lg font-bold focus:outline-none focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Alle wie viele Minuten sollen Reminders angezeigt werden?</p>
        </div>

        {/* Preview */}
        <div className="bg-blue-50 rounded-xl p-4 mt-4">
          <p className="text-sm font-bold text-blue-700 mb-2">📋 Vorschau:</p>
          <p className="text-xs text-blue-600">
            • Spieldauer: <span className="font-bold">{settings.gameDuration} Minuten</span>
          </p>
          <p className="text-xs text-blue-600">
            • Reminders alle: <span className="font-bold">{settings.reminderInterval} Minuten</span>
          </p>
          <p className="text-xs text-blue-600 mt-2">
            Reminders werden angezeigt bei: {Array.from(
              { length: Math.floor(settings.gameDuration / settings.reminderInterval) },
              (_, i) => settings.gameDuration - (i + 1) * settings.reminderInterval
            ).join(', ')} Minuten verbleibend
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95"
          >
            {saved ? '✅ Gespeichert!' : '💾 Speichern'}
          </button>
          <button
            onClick={handleReset}
            className="flex-1 border-2 border-gray-300 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-all active:scale-95"
          >
            🔄 Zurücksetzen
          </button>
        </div>
      </div>
    </div>
  );
}
