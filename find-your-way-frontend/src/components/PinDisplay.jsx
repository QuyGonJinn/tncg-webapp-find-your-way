export default function PinDisplay({ pin, onContinue }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 flex flex-col items-center justify-center p-6">
      <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center">
        <div className="text-5xl mb-4">🔑</div>
        <h2 className="text-2xl font-black text-blue-900 mb-2">Euer Team-Code</h2>
        <p className="text-slate-500 text-sm mb-6">
          Merkt euch diesen Code! Damit könnt ihr euch auf jedem Gerät wieder einloggen, falls der Browser geschlossen wird.
        </p>

        <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl py-5 px-6 mb-6">
          <p className="text-5xl font-black tracking-widest text-blue-700 select-all">{pin}</p>
        </div>

        <p className="text-xs text-slate-400 mb-6">Tipp: Macht ein Foto von diesem Code 📸</p>

        <button
          onClick={onContinue}
          className="w-full bg-blue-600 text-white font-black text-xl py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
        >
          Los geht's 🌊
        </button>
      </div>
    </div>
  );
}
