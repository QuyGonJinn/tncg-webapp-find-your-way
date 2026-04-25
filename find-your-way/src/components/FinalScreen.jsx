import { STATIONS } from '../data/stations';

export default function FinalScreen({ team, completed, totalXP, onReset }) {
  const completedCount = Object.keys(completed).length;
  const activeCompleted = STATIONS.filter(s => s.type === 'aktiv' && completed[s.id]).length;
  const maxXP = STATIONS.reduce((sum, s) => sum + s.points, 0);
  const percent = Math.round((totalXP / maxXP) * 100);

  function getRank() {
    if (percent >= 90) return { label: 'Legendär 🏆', color: 'text-yellow-500' };
    if (percent >= 70) return { label: 'Meister 🥇', color: 'text-orange-500' };
    if (percent >= 50) return { label: 'Fortgeschritten 🥈', color: 'text-gray-500' };
    return { label: 'Einsteiger 🥉', color: 'text-amber-700' };
  }

  const rank = getRank();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-800 flex flex-col items-center justify-center p-6 text-white">
      <div className="bounce-in text-center">
        <div className="text-7xl mb-4">🎉</div>
        <h1 className="text-4xl font-black mb-1">Zeit abgelaufen!</h1>
        <p className="text-indigo-200 text-lg mb-8">Das war eine epische Schnitzeljagd!</p>
      </div>

      <div className="bg-white text-gray-800 rounded-3xl shadow-2xl p-6 w-full max-w-sm">
        <div className="text-center mb-6">
          <span className="text-5xl">{team.icon}</span>
          <h2 className="text-2xl font-black mt-2">{team.name}</h2>
          <p className={`text-xl font-black mt-1 ${rank.color}`}>{rank.label}</p>
        </div>

        <div className="bg-indigo-50 rounded-2xl p-4 mb-4 text-center">
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Gesamtpunkte</p>
          <p className="text-5xl font-black text-indigo-600 mt-1">{totalXP} XP</p>
          <p className="text-gray-400 text-sm mt-1">von {maxXP} möglichen XP ({percent}%)</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-green-50 rounded-2xl p-3 text-center">
            <p className="text-2xl font-black text-green-600">{completedCount}</p>
            <p className="text-xs text-gray-500 font-semibold">Stationen</p>
          </div>
          <div className="bg-orange-50 rounded-2xl p-3 text-center">
            <p className="text-2xl font-black text-orange-500">{activeCompleted}</p>
            <p className="text-xs text-gray-500 font-semibold">Aktive</p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="w-full bg-indigo-600 text-white font-black text-xl py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
        >
          Nochmal spielen 🔄
        </button>
      </div>
    </div>
  );
}
