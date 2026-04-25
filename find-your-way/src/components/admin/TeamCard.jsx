import { useState } from 'react';
import { STATIONS } from '../../data/stations';

const MAX_XP = STATIONS.reduce((s, st) => s + st.points, 0);

export default function TeamCard({ team, onUncomplete, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const completedCount = Object.keys(team.completed || {}).length;
  const progress = Math.round((completedCount / STATIONS.length) * 100);
  const activeCompleted = STATIONS.filter(s => s.type === 'aktiv' && team.completed?.[s.id]).length;

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{team.icon}</span>
          <div>
            <p className="font-black text-slate-800">{team.name}</p>
            <p className="text-teal-600 font-bold text-sm">{team.totalXP} / {MAX_XP} XP</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-slate-500 text-sm">{completedCount}/12 Stationen</p>
          <p className="text-orange-500 text-xs font-semibold">⚡ {activeCompleted} aktive</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-cyan-100 rounded-full h-2 mt-3 overflow-hidden">
        <div className="bg-teal-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full text-center text-teal-600 text-sm font-semibold mt-2"
      >
        {expanded ? '▲ Einklappen' : '▼ Stationen anzeigen'}
      </button>

      {expanded && (
        <div className="mt-3 flex flex-col gap-1">
          {STATIONS.map(s => {
            const done = !!team.completed?.[s.id];
            return (
              <div key={s.id} className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm ${done ? 'bg-teal-50' : 'bg-gray-50'}`}>
                <span className={done ? 'text-teal-700 font-semibold' : 'text-gray-400'}>
                  {s.emoji} {s.title}
                </span>
                {done ? (
                  <button
                    onClick={() => onUncomplete(team.id, s.id)}
                    className="text-xs text-red-400 font-bold hover:text-red-600"
                  >
                    ✕ Zurücksetzen
                  </button>
                ) : (
                  <span className="text-gray-300 text-xs">offen</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={() => { if (confirm(`Team "${team.name}" wirklich löschen?`)) onDelete(team.id); }}
        className="w-full mt-3 text-xs text-red-400 font-semibold border border-red-200 rounded-xl py-2 hover:bg-red-50"
      >
        Team löschen
      </button>
    </div>
  );
}
