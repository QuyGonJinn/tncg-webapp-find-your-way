import { useState } from 'react';
import { getStations } from '../data/stations';
import { useI18n } from '../hooks/useI18n';
import LanguageSwitcherDropdown from './LanguageSwitcherDropdown';
import StationCard from './StationCard';
import Timer from './Timer';
import HintBox from './HintBox';
import ChatBox from './ChatBox';
import ReminderNotification from './ReminderNotification';

export default function GameScreen({ team, completed, pending, timeLeft, xpPopups, onComplete, onReset, totalXP }) {
  const { t } = useI18n();
  const stations = getStations(t);
  const [tab, setTab] = useState(() => {
    return localStorage.getItem('fyw_active_tab') || 'stations';
  });

  const completedCount = Object.keys(completed).length;
  const activeCompleted = stations.filter(s => s.type === 'aktiv' && completed[s.id]).length;
  const progress = Math.round((completedCount / stations.length) * 100);

  const handleTabChange = (newTab) => {
    setTab(newTab);
    localStorage.setItem('fyw_active_tab', newTab);
  };

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      {/* Reminder Notifications */}
      <ReminderNotification timeLeft={timeLeft} />

      {/* Header */}
      <div className="bg-gradient-to-r from-stone-900 to-amber-900 text-amber-100 px-4 pt-6 pb-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{team.icon}</span>
            <div>
              <p className="font-black text-lg leading-tight text-amber-50">{team.name}</p>
              <p className="text-yellow-400 text-sm font-bold">⭐ {totalXP} XP</p>
            </div>
          </div>
          <Timer timeLeft={timeLeft} />
        </div>

        {/* Progress bar */}
        <div className="bg-stone-800/60 rounded-full h-3 overflow-hidden">
          <div
            className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-amber-300 mt-1">
          <span>{completedCount}/{stations.length} {t('game.progress')}</span>
          <span>⚡ {activeCompleted} {t('game.active')}</span>
          <span>{progress}%</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-3 items-center">
          <button
            onClick={() => handleTabChange('stations')}
            className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${
              tab === 'stations' ? 'bg-amber-100 text-amber-900' : 'bg-stone-800/50 text-amber-300'
            }`}
          >
            {t('game.stations')}
          </button>
          <button
            onClick={() => handleTabChange('chat')}
            className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${
              tab === 'chat' ? 'bg-amber-100 text-amber-900' : 'bg-stone-800/50 text-amber-300'
            }`}
          >
            {t('game.chat')}
          </button>
          <div className="ml-auto">
            <LanguageSwitcherDropdown />
          </div>
        </div>
      </div>

      {/* XP Popups */}
      <div className="fixed top-36 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        {xpPopups.map(p => (
          <div key={p.id} className="xp-pop text-center font-black text-3xl text-yellow-500 drop-shadow-lg">
            +{p.points} XP ⭐
          </div>
        ))}
      </div>

      {/* Content */}
      {tab === 'stations' ? (
        <div className="flex-1 pb-8">
          <HintBox completedCount={completedCount} />
          <div className="px-4 flex flex-col gap-3 mt-4">
            {stations.map(station => (
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
              className="w-full border-2 border-amber-300 text-amber-700 font-bold py-3 rounded-2xl text-sm active:scale-95 transition-transform"
            >
              {t('game.resetGame')}
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
