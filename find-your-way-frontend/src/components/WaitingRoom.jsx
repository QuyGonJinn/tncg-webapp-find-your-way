import { useEffect, useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import LanguageSwitcherDropdown from './LanguageSwitcherDropdown';

export default function WaitingRoom({ team, onGameStart }) {
  const { t } = useI18n();
  const [participantCount, setParticipantCount] = useState(0);
  const [allTeams, setAllTeams] = useState([]);

  useEffect(() => {
    // Fetch all teams to show how many are waiting
    const fetchTeams = async () => {
      try {
        const response = await fetch('/api/teams');
        const teams = await response.json();
        setAllTeams(teams);
        setParticipantCount(teams.length);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
    const interval = setInterval(fetchTeams, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  // Check if game has started
  useEffect(() => {
    const checkGameState = async () => {
      try {
        const response = await fetch('/api/game/state');
        const state = await response.json();
        
        if (state.waiting_room_enabled === 'false' || state.timerRunning === true) {
          onGameStart();
        }
      } catch (error) {
        console.error('Error checking game state:', error);
      }
    };

    const interval = setInterval(checkGameState, 1000); // Check every second
    return () => clearInterval(interval);
  }, [onGameStart]);

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      {/* Language Switcher - Top Right */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcherDropdown />
      </div>

      {/* Header - gleich wie GameScreen */}
      <div className="bg-gradient-to-r from-stone-900 to-amber-900 text-amber-100 px-4 pt-6 pb-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{team?.icon}</span>
            <div>
              <p className="font-black text-lg leading-tight text-amber-50">{team?.name}</p>
              <p className="text-yellow-400 text-sm font-bold">{t('waitingRoom.status')}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-yellow-400">{participantCount}</p>
            <p className="text-xs text-amber-300">{t('waitingRoom.teamsWaiting')}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Team Info Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full mb-8 border-2 border-amber-200">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">{team?.icon}</div>
            <h2 className="text-2xl font-black text-stone-900">{team?.name}</h2>
            <p className="text-sm text-amber-700 font-bold mt-2">Team-Code: <span className="font-mono text-lg text-amber-900">{team?.pin}</span></p>
          </div>

          {/* Status Message */}
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-4 text-center">
            <p className="text-sm text-yellow-900 font-bold">{t('waitingRoom.gameStartsShortly')}</p>
            <p className="text-xs text-yellow-800 mt-2">{t('waitingRoom.adminActivatesGame')}</p>
          </div>
        </div>

        {/* Waiting Animation */}
        <div className="flex gap-2 justify-center mb-8">
          <div className="w-3 h-3 bg-amber-700 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-amber-700 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-amber-700 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>

        {/* Tips */}
        <div className="bg-amber-100 rounded-2xl p-6 max-w-md w-full border-2 border-amber-200">
          <p className="text-sm text-amber-900 font-bold mb-3">{t('waitingRoom.tipsWhileWaiting')}</p>
          <ul className="text-sm text-amber-800 space-y-2">
            <li>{t('waitingRoom.tip1')}</li>
            <li>{t('waitingRoom.tip2')}</li>
            <li>{t('waitingRoom.tip3')}</li>
            <li>{t('waitingRoom.tip4')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
