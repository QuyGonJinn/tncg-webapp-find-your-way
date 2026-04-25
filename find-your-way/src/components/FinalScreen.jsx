import { STATIONS } from '../data/stations';

export default function FinalScreen({ team, completed, totalXP, onReset }) {
  const completedCount = Object.keys(completed).length;
  const activeCompleted = STATIONS.filter(s => s.type === 'aktiv' && completed[s.id]).length;
  const maxXP = STATIONS.reduce((sum, s) => sum + s.points, 0);
  const percent = Math.round((totalXP / maxXP) * 100);

  function getRank() {
    if (percent >= 90) return { label: 'Legendär 🏆', color: 'text-yellow-400' };
    if (percent >= 70) return { label: 'Meister 🥇', color: 'text-orange-400' };
    if (percent >= 50) return { label: 'Fortgeschritten 🥈', color: 'text-blue-300' };
    return { label: 'Einsteiger 🥉', color: 'text-blue-200' };
  }

  const rank = getRank();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 flex flex-col items-center justify-center p-6 text-white">
      <div className="bounce-in text-center">
        <div className="text-7xl mb-4">⚓</div>
        <h1 className="text-4xl font-black mb-1">Anker geworfen!</h1>
        <p className="text-blue-200 text-lg mb-8">Ihr habt euren Weg gefunden.</p>
      </div>

      <div className="bg-white/95 backdrop-blur text-slate-800 rounded-3xl shadow-2xl p-6 w-full max-w-sm">
        <div className="text-center mb-6">
          <span className="text-5xl">{team.icon}</span>
          <h2 className="text-2xl font-black mt-2">{team.name}</h2>
          <p className={`text-xl font-black mt-1 ${rank.color}`}>{rank.label}</p>
        </div>

        <div className="bg-blue-50 rounded-2xl p-4 mb-4 text-center">
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">Gesamtpunkte</p>
          <p className="text-5xl font-black text-blue-600 mt-1">{totalXP} XP</p>
          <p className="text-slate-400 text-sm mt-1">von {maxXP} möglichen XP ({percent}%)</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-blue-50 rounded-2xl p-3 text-center">
            <p className="text-2xl font-black text-blue-600">{completedCount}</p>
            <p className="text-xs text-slate-500 font-semibold">Stationen</p>
          </div>
          <div className="bg-orange-50 rounded-2xl p-3 text-center">
            <p className="text-2xl font-black text-orange-500">{activeCompleted}</p>
            <p className="text-xs text-slate-500 font-semibold">Aktive</p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="w-full bg-blue-600 text-white font-black text-xl py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
        >
          Nochmal spielen 🌊
        </button>
      </div>
    </div>
  );
}
