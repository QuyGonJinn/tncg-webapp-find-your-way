import { useState } from 'react';
import { STATIONS } from '../data/stations';
import StationCard from './StationCard';
import Timer from './Timer';
import HintBox from './HintBox';
import ChatBox from './ChatBox';

export default function GameScreen({ team, completed, pending, timeLeft, xpPopups, onComplete, onReset, totalXP }) {
  const [tab, setTab] = useState('stations'); // stations | chat
  const completedCount = Object.keys(completed).length;
  const activeCompleted = STATIONS.filter(s => s.type === 'aktiv' && completed[s.id]).length;
  const progress = Math.round((completedCount / STATIONS.length) * 100);

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
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

        {/* Tabs */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setTab('stations')}
            className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${
              tab === 'stations' ? 'bg-white text-blue-700' : 'bg-blue-700/50 text-blue-200'
            }`}
          >
            🗺️ Stationen
          </button>
          <button
            onClick={() => setTab('chat')}
            className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${
              tab === 'chat' ? 'bg-white text-blue-700' : 'bg-blue-700/50 text-blue-200'
            }`}
          >
            💬 Chat
          </button>
        </div>
      </div>

      {/* XP Popups */}
      <div className="fixed top-36 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        {xpPopups.map(p => (
          <div key={p.id} className="xp-pop text-center font-black text-3xl text-blue-400 drop-shadow-lg">
            +{p.points} XP 🌊
          </div>
        ))}
      </div>

      {/* Content */}
      {tab === 'stations' ? (
        <div className="flex-1 pb-8">
          <HintBox completedCount={completedCount} />
          <div className="px-4 flex flex-col gap-3 mt-4">
            {STATIONS.map(station => (
              <StationCard
                key={station.id}
                station={station}
                done={!!completed[station.id]}
                pending={!!pending[station.id]}
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
      ) : (
        <div className="flex-1 flex flex-col" style={{ height: 'calc(100vh - 220px)' }}>
          <ChatBox team={team} />
        </div>
      )}
    </div>
  );
}
