import { useState } from 'react';
import { STATIONS } from '../data/stations';

export default function StationCard({ station, done, pending, onComplete }) {
  const [showCode, setShowCode] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isActive = station.type === 'aktiv';

  // Get next station
  const nextStation = STATIONS.find(s => s.id === station.id + 1);

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
    <>
      <div className={`relative rounded-2xl p-4 shadow-md transition-all cursor-pointer hover:shadow-lg ${
        done    ? 'bg-blue-50 border-2 border-blue-400 opacity-80' :
        pending ? 'bg-yellow-50 border-2 border-yellow-400' :
                  'bg-white border-2 border-blue-100'
      }`}
      onClick={() => !done && !pending && setShowInfo(true)}>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    isActive ? handleSubmit({ preventDefault: () => {} }) : setShowCode(true);
                  }}
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

            {/* Next station hint when done */}
            {done && nextStation && (
              <div className="mt-3 bg-green-50 border-2 border-green-200 rounded-xl p-3">
                <p className="text-xs font-bold text-green-700 mb-1">🎯 Nächste Station:</p>
                <p className="text-sm font-bold text-green-800">{nextStation.emoji} {nextStation.title}</p>
                <p className="text-xs text-green-600 mt-1">📍 {nextStation.location}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowInfo(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 sticky top-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{station.emoji}</span>
                <h2 className="text-2xl font-black">{station.title}</h2>
              </div>
              <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
                isActive ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {isActive ? '⚡ Aktiv' : '🌊 Passiv'}
              </span>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-black text-blue-700 mb-2">📝 Aufgabe</h3>
                <p className="text-slate-700 leading-relaxed">{station.instructions}</p>
              </div>

              <div className="bg-blue-50 rounded-2xl p-4">
                <p className="text-sm text-slate-600">
                  <span className="font-bold text-blue-700">Punkte:</span> +{station.points} XP
                </p>
              </div>

              <div className="bg-blue-50 rounded-2xl p-4">
                <p className="text-sm text-slate-600">
                  <span className="font-bold text-blue-700">📍 Ort:</span> {station.location}
                </p>
              </div>

              <button
                onClick={() => setShowInfo(false)}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl active:scale-95 transition-transform"
              >
                Verstanden! 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
