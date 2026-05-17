import { useEffect, useState } from 'react';

export default function WaitingRoom({ team, onGameStart }) {
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
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🌊</div>
        <h1 className="text-4xl font-black text-stone-900 mb-2">Find Your Way</h1>
        <p className="text-xl text-amber-900 font-bold">Wartezimmer</p>
      </div>

      {/* Team Info */}
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full mb-8 border-2 border-amber-200">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{team?.icon}</div>
          <h2 className="text-2xl font-black text-stone-900">{team?.name}</h2>
          <p className="text-sm text-amber-700 font-bold mt-2">Team-Code: <span className="font-mono text-lg text-amber-900">{team?.pin}</span></p>
        </div>

        {/* Participant Count */}
        <div className="bg-amber-100 rounded-2xl p-4 text-center mb-6 border-2 border-amber-200">
          <p className="text-sm text-amber-700 font-bold uppercase tracking-wide mb-2">Wartende Teams</p>
          <p className="text-4xl font-black text-amber-900">{participantCount}</p>
        </div>

        {/* Status Message */}
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-4 text-center">
          <p className="text-sm text-yellow-900 font-bold">⏳ Das Spiel startet in Kürze...</p>
          <p className="text-xs text-yellow-800 mt-2">Der Admin aktiviert das Spiel</p>
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
        <p className="text-sm text-amber-900 font-bold mb-3">💡 Tipps während du wartest:</p>
        <ul className="text-sm text-amber-800 space-y-2">
          <li>✓ Überprüft eure Geräte-Akkus</li>
          <li>✓ Testet die WLAN-Verbindung</li>
          <li>✓ Merkt euch euren Team-Code</li>
          <li>✓ Plant eure Route zu den Stationen</li>
        </ul>
      </div>
    </div>
  );
}
