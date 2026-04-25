import { STATIONS } from '../data/stations';
import StationCard from './StationCard';
import Timer from './Timer';
import HintBox from './HintBox';

export default function GameScreen({ team, completed, timeLeft, xpPopups, onComplete, onReset, totalXP }) {
  const completedCount = Object.keys(completed).length;
  const activeCompleted = STATIONS.filter(s => s.type === 'aktiv' && completed[s.id]).length;
  const progress = Math.round((completedCount / STATIONS.length) * 100);

  return (
    <div className="min-h-screen bg-blue-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 pt-6 pb-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{team.icon}</span>
            <div>
              <p className="font-black text-lg leading-tight">{team.name}</p>
              <p className="text-blue-200 text-sm font-bold">{totalXP} XP</p>
            </div>
          </div>
          <Timer timeLeft={timeLeft} />
        </div>

        {/* Progress bar */}
        <div className="bg-blue-900/50 rounded-full h-3 overflow-hidden">
          <div
            className="bg-blue-300 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-blue-200 mt-1">
          <span>{completedCount}/12 Stationen</span>
          <span>⚡ {activeCompleted} aktive</span>
          <span>{progress}%</span>
        </div>
      </div>

      {/* XP Popups */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        {xpPopups.map(p => (
          <div key={p.id} className="xp-pop text-center font-black text-3xl text-blue-400 drop-shadow-lg">
            +{p.points} XP 🌊
          </div>
        ))}
      </div>

      <HintBox completedCount={completedCount} />

      {/* Stations */}
      <div className="px-4 flex flex-col gap-3 mt-4">
        {STATIONS.map(station => (
          <StationCard
            key={station.id}
            station={station}
            done={!!completed[station.id]}
            onComplete={onComplete}
          />
        ))}
      </div>

      <div className="px-4 mt-6">
        <button
          onClick={onReset}
          className="w-full border-2 border-blue-200 text-blue-400 font-bold py-3 rounded-2xl text-sm active:scale-95 transition-transform"
        >
          Spiel zurücksetzen
        </button>
      </div>
    </div>
  );
}
