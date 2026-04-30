import { useState, useEffect } from 'react';
import { fetchGameState } from '../../api';

export default function ReminderSettings() {
  const [reminderInterval, setReminderInterval] = useState(20);
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const state = await fetchGameState();
      const interval = state.reminderInterval || 20;
      setReminderInterval(interval);
    } catch (err) {
      console.error('Fehler beim Laden der Einstellungen:', err);
    }
  }

  async function handleSave() {
    setLoading(true);
    try {
      const response = await fetch('/api/game/reminder-interval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interval: reminderInterval }),
      });
      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error('Fehler beim Speichern:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow p-4 mb-4">
      <h2 className="text-blue-700 font-black text-lg mb-4">⏰ Erinnerungen</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Erinnerung alle X Minuten:
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min="1"
              max="60"
              step="1"
              value={reminderInterval}
              onChange={(e) => setReminderInterval(Number(e.target.value))}
              className="w-20 border-2 border-blue-200 rounded-xl px-3 py-2 font-bold text-center focus:outline-none focus:border-blue-500"
            />
            <span className="text-slate-600 font-semibold">Minuten</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Die Teilnehmer erhalten alle {reminderInterval} Minuten eine Meldung, wie lange das Spiel noch läuft.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3 rounded-xl transition-all"
        >
          {loading ? '⏳ Speichern...' : saved ? '✅ Gespeichert!' : '💾 Speichern'}
        </button>
      </div>
    </div>
  );
}
