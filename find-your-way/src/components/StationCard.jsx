import { useState } from 'react';

export default function StationCard({ station, done, pending, onComplete }) {
  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isActive = station.type === 'aktiv';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onComplete(station, isActive ? null : code.toUpperCase());
      setShowCode(false);
      setCode('');
    } catch (err) {
      setError(err.message || 'Fehler');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`relative rounded-2xl p-4 shadow-md transition-all ${
      done    ? 'bg-blue-50 border-2 border-blue-400 opacity-80' :
      pending ? 'bg-yellow-50 border-2 border-yellow-400' :
                'bg-white border-2 border-blue-100'
    }`}>
      <div className="flex items-start gap-3">
        <span className="text-3xl">{station.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`font-bold text-base leading-tight ${done ? 'text-blue-700' : pending ? 'text-yellow-700' : 'text-slate-800'}`}>
              {station.title}
            </h3>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              isActive ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
            }`}>
              {isActive ? '⚡ Aktiv' : '🌊 Passiv'}
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1 leading-snug">{station.description}</p>

          <div className="flex items-center justify-between mt-3">
            <span className={`font-black text-lg ${isActive ? 'text-orange-500' : 'text-blue-600'}`}>
              +{station.points} XP
            </span>

            {done ? (
              <span className="text-blue-600 font-bold text-sm">✅ Erledigt</span>
            ) : pending ? (
              <span className="text-yellow-600 font-bold text-sm">⏳ Wartet auf Bestätigung</span>
            ) : showCode ? null : (
              <button
                onClick={() => isActive ? handleSubmit({ preventDefault: () => {} }) : setShowCode(true)}
                className="bg-blue-600 text-white font-bold text-sm px-4 py-2 rounded-xl active:scale-95 transition-transform shadow"
              >
                {isActive ? 'Erledigt melden' : 'Code eingeben'}
              </button>
            )}
          </div>

          {/* Code input for passive stations */}
          {!done && !pending && showCode && (
            <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2">
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase().slice(0, 4))}
                placeholder="Code eingeben"
                maxLength={4}
                className="w-full border-2 border-blue-200 rounded-xl px-4 py-2 text-xl font-black text-center tracking-widest focus:outline-none focus:border-blue-500"
                autoFocus
              />
              {error && <p className="text-red-500 text-xs text-center font-semibold">{error}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setShowCode(false); setCode(''); setError(''); }}
                  className="flex-1 border-2 border-gray-200 text-gray-500 font-bold py-2 rounded-xl text-sm"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={code.length < 4 || loading}
                  className="flex-1 bg-blue-600 disabled:bg-blue-200 text-white font-bold py-2 rounded-xl text-sm active:scale-95 transition-transform"
                >
                  {loading ? '...' : 'Bestätigen'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
