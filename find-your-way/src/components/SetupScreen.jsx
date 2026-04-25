import { useState } from 'react';
import { TEAM_ICONS } from '../data/stations';

export default function SetupScreen({ onStart, error }) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(TEAM_ICONS[0]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onStart({ name: name.trim(), icon });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500 via-teal-600 to-blue-800 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-8">
        <div className="text-6xl mb-3">⚓</div>
        <h1 className="text-4xl font-black text-white tracking-tight">Find Your Way</h1>
        <p className="text-cyan-100 mt-2 text-lg">Die ultimative Schnitzeljagd</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-6 w-full max-w-sm">
        <label className="block text-teal-800 font-bold mb-2 text-lg">Teamname</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="z.B. Die Wellen"
          maxLength={20}
          className="w-full border-2 border-cyan-200 rounded-2xl px-4 py-3 text-xl font-semibold focus:outline-none focus:border-teal-500 mb-6"
        />

        <label className="block text-teal-800 font-bold mb-3 text-lg">Team-Icon wählen</label>
        <div className="grid grid-cols-6 gap-2 mb-6">
          {TEAM_ICONS.map(ic => (
            <button
              key={ic}
              type="button"
              onClick={() => setIcon(ic)}
              className={`text-3xl p-2 rounded-xl transition-all ${icon === ic ? 'bg-cyan-100 ring-2 ring-teal-500 scale-110' : 'hover:bg-cyan-50'}`}
            >
              {ic}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full bg-teal-600 disabled:bg-gray-300 text-white font-black text-xl py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
        >
          Spiel starten 🌊
        </button>
        {error && <p className="text-red-500 text-sm text-center mt-3 font-semibold">{error}</p>}
      </form>
    </div>
  );
}
