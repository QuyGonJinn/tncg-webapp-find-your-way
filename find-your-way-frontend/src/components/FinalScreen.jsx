import { STATIONS } from '../data/stations';

export default function FinalScreen({ team, completed, totalXP, onReset }) {
  const completedCount = Object.keys(completed).length;
  const activeCompleted = STATIONS.filter(s => s.type === 'aktiv' && completed[s.id]).length;
  const maxXP = STATIONS.reduce((sum, s) => sum + s.points, 0);
  const percent = Math.round((totalXP / maxXP) * 100);

  function getRank() {
    if (percent >= 90) return { label: 'Legendär 🏆', color: 'text-yellow-500' };
    if (percent >= 70) return { label: 'Meister 🥇', color: 'text-amber-600' };
    if (percent >= 50) return { label: 'Fortgeschritten 🥈', color: 'text-stone-500' };
    return { label: 'Einsteiger 🥉', color: 'text-amber-400' };
  }

  const rank = getRank();

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-amber-900 to-amber-700 flex flex-col items-center justify-center p-6 text-amber-100">
      <div className="bounce-in text-center">
        <div className="text-7xl mb-4">🗺️</div>
        <h1 className="text-4xl font-black mb-1">Schatz gefunden!</h1>
        <p className="text-amber-300 text-lg mb-8">Ihr habt euren Weg gefunden.</p>
      </div>

      <div className="bg-amber-50 text-stone-800 rounded-3xl shadow-2xl p-6 w-full max-w-sm border-2 border-amber-300">
        <div className="text-center mb-6">
          <span className="text-5xl">{team.icon}</span>
          <h2 className="text-2xl font-black mt-2 text-stone-800">{team.name}</h2>
          <p className={`text-xl font-black mt-1 ${rank.color}`}>{rank.label}</p>
        </div>

        <div className="bg-amber-100 border border-amber-300 rounded-2xl p-4 mb-4 text-center">
          <p className="text-stone-500 text-sm font-semibold uppercase tracking-wide">Gesamtpunkte</p>
          <p className="text-5xl font-black text-amber-700 mt-1">{totalXP} XP</p>
          <p className="text-stone-400 text-sm mt-1">von {maxXP} möglichen XP ({percent}%)</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-amber-100 border border-amber-200 rounded-2xl p-3 text-center">
            <p className="text-2xl font-black text-amber-700">{completedCount}</p>
            <p className="text-xs text-stone-500 font-semibold">Stationen</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3 text-center">
            <p className="text-2xl font-black text-orange-600">{activeCompleted}</p>
            <p className="text-xs text-stone-500 font-semibold">Aktive</p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="w-full bg-amber-700 text-white font-black text-xl py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
        >
          Nochmal spielen 🗺️
        </button>
      </div>
    </div>
  );
}
