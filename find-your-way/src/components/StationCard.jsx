export default function StationCard({ station, done, onComplete }) {
  const isActive = station.type === 'aktiv';

  return (
    <div
      className={`relative rounded-2xl p-4 shadow-md transition-all ${
        done
          ? 'bg-green-50 border-2 border-green-400 opacity-80'
          : 'bg-white border-2 border-gray-100 active:scale-95'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">{station.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`font-bold text-base leading-tight ${done ? 'text-green-700' : 'text-gray-800'}`}>
              {station.title}
            </h3>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              isActive ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
            }`}>
              {isActive ? '⚡ Aktiv' : '📖 Passiv'}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1 leading-snug">{station.description}</p>
          <div className="flex items-center justify-between mt-3">
            <span className={`font-black text-lg ${isActive ? 'text-orange-500' : 'text-blue-500'}`}>
              +{station.points} XP
            </span>
            {done ? (
              <span className="text-green-600 font-bold text-sm flex items-center gap-1">
                ✅ Erledigt
              </span>
            ) : (
              <button
                onClick={() => onComplete(station)}
                className="bg-indigo-600 text-white font-bold text-sm px-4 py-2 rounded-xl active:scale-95 transition-transform shadow"
              >
                Abhaken
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
