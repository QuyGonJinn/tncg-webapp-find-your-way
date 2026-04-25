export default function AdminTimer({ gameState, onStart, onPause, onReset }) {
  const { timeLeft, timerRunning } = gameState;
  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;
  const pad = n => String(n).padStart(2, '0');
  const urgent = timeLeft < 600;

  return (
    <div className="bg-white rounded-2xl shadow p-4 mb-4">
      <h2 className="text-teal-700 font-black text-lg mb-3">⏱ Timer</h2>
      <div className={`text-5xl font-mono font-black text-center mb-4 ${urgent ? 'text-red-500' : 'text-teal-700'}`}>
        {pad(h)}:{pad(m)}:{pad(s)}
      </div>
      <div className="flex gap-2">
        {timerRunning ? (
          <button onClick={onPause} className="flex-1 bg-yellow-400 text-white font-bold py-3 rounded-xl active:scale-95 transition-transform">
            ⏸ Pause
          </button>
        ) : (
          <button onClick={onStart} className="flex-1 bg-teal-600 text-white font-bold py-3 rounded-xl active:scale-95 transition-transform">
            ▶ Start
          </button>
        )}
        <button onClick={onReset} className="flex-1 bg-red-100 text-red-600 font-bold py-3 rounded-xl active:scale-95 transition-transform">
          🔄 Reset
        </button>
      </div>
      <p className="text-center text-xs text-gray-400 mt-2">
        Status: {timerRunning ? '🟢 Läuft' : '🔴 Gestoppt'}
      </p>
    </div>
  );
}
