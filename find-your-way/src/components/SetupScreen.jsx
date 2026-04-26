import { useState } from 'react';
import { TEAM_ICONS } from '../data/stations';

export default function SetupScreen({ onStart, onLogin, error }) {
  const [tab, setTab] = useState('new'); // new | login
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(TEAM_ICONS[0]);
  const [pin, setPin] = useState('');

  function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onStart({ name: name.trim(), icon });
  }

  function handleLogin(e) {
    e.preventDefault();
    if (pin.trim().length < 4) return;
    onLogin(pin.trim());
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-8">
        <div className="text-6xl mb-3">⚓</div>
        <h1 className="text-4xl font-black text-white tracking-tight">Find Your Way</h1>
        <p className="text-blue-100 mt-2 text-lg">Die ultimative Glaubensjagd</p>
      </div>

      <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-blue-100">
          <button
            onClick={() => setTab('new')}
            className={`flex-1 py-3 font-bold text-sm transition-all ${tab === 'new' ? 'text-blue-700 border-b-2 border-blue-600' : 'text-gray-400'}`}
          >
            🆕 Neues Team
          </button>
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-3 font-bold text-sm transition-all ${tab === 'login' ? 'text-blue-700 border-b-2 border-blue-600' : 'text-gray-400'}`}
          >
            🔑 Mit Code einloggen
          </button>
        </div>

        <div className="p-6">
          {tab === 'new' ? (
            <form onSubmit={handleCreate}>
              <label className="block text-blue-900 font-bold mb-2 text-lg">Teamname</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="z.B. Die Wellen"
                maxLength={20}
                className="w-full border-2 border-blue-200 rounded-2xl px-4 py-3 text-xl font-semibold focus:outline-none focus:border-blue-500 mb-5"
              />

              <label className="block text-blue-900 font-bold mb-3 text-lg">Team-Icon wählen</label>
              <div className="grid grid-cols-6 gap-3 mb-6">
                {TEAM_ICONS.map(ic => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setIcon(ic)}
                    className={`text-4xl p-3 rounded-2xl transition-all aspect-square flex items-center justify-center ${icon === ic ? 'bg-blue-100 ring-2 ring-blue-500 scale-110' : 'hover:bg-blue-50 bg-gray-50'}`}
                  >
                    {ic}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={!name.trim()}
                className="w-full bg-blue-600 disabled:bg-gray-300 text-white font-black text-xl py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
              >
                Spiel starten 🌊
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <p className="text-slate-500 text-sm mb-4">Gebt euren 4-stelligen Team-Code ein, den ihr beim Erstellen bekommen habt.</p>
              <label className="block text-blue-900 font-bold mb-2 text-lg">Team-Code</label>
              <input
                type="text"
                value={pin}
                onChange={e => setPin(e.target.value.toUpperCase().slice(0, 4))}
                placeholder="z.B. A3KX"
                maxLength={4}
                className="w-full border-2 border-blue-200 rounded-2xl px-4 py-4 text-3xl font-black text-center tracking-widest focus:outline-none focus:border-blue-500 mb-6"
              />
              <button
                type="submit"
                disabled={pin.trim().length < 4}
                className="w-full bg-blue-600 disabled:bg-gray-300 text-white font-black text-xl py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
              >
                Einloggen 🔑
              </button>
            </form>
          )}

          {error && <p className="text-red-500 text-sm text-center mt-3 font-semibold">{error}</p>}
        </div>
      </div>
    </div>
  );
}
