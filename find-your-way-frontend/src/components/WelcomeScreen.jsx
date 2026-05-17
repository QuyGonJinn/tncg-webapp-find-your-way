export default function WelcomeScreen({ onContinue }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-800 via-stone-800 to-stone-900 flex flex-col items-center justify-center p-6">
      {/* Logo & Title */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-3 animate-bounce">🗺️</div>
        <h1 className="text-4xl font-black text-amber-100 tracking-tight">Find Your Way</h1>
        <p className="text-amber-300 mt-2 text-lg">Die ultimative Glaubensjagd</p>
      </div>

      {/* Welcome Card */}
      <div className="bg-amber-50 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border-2 border-amber-300 p-8">
        {/* Welcome Text */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🌊</div>
          <h2 className="text-2xl font-black text-stone-900 mb-3">Willkommen!</h2>
          <p className="text-stone-700 text-sm leading-relaxed">
            Ihr seid dabei bei einer spannenden Schnitzeljagd mit Glaubensthema. Arbeitet als Team zusammen, löst Aufgaben und sammelt Punkte!
          </p>
        </div>

        {/* How it works */}
        <div className="bg-amber-100 border-2 border-amber-300 rounded-2xl p-5 mb-8">
          <p className="text-amber-900 font-black text-sm mb-4">📋 So funktioniert's:</p>
          <ul className="space-y-3 text-sm text-amber-900">
            <li className="flex gap-2">
              <span className="font-black">1️⃣</span>
              <span><strong>Team erstellen:</strong> Gebt einen Namen ein und wählt ein Icon</span>
            </li>
            <li className="flex gap-2">
              <span className="font-black">2️⃣</span>
              <span><strong>Stationen erledigen:</strong> Löst Aufgaben und sammelt Punkte</span>
            </li>
            <li className="flex gap-2">
              <span className="font-black">3️⃣</span>
              <span><strong>Rangliste:</strong> Konkurriert mit anderen Teams</span>
            </li>
            <li className="flex gap-2">
              <span className="font-black">4️⃣</span>
              <span><strong>Finale:</strong> Nach 2 Stunden seht ihr euren Rang</span>
            </li>
          </ul>
        </div>

        {/* Key Info */}
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-5 mb-8">
          <p className="text-yellow-900 font-bold text-sm mb-2">⚡ Wichtig:</p>
          <ul className="space-y-2 text-xs text-yellow-900">
            <li>✓ <strong>Passive Stationen:</strong> Code eingeben → +20 XP</li>
            <li>✓ <strong>Aktive Stationen:</strong> Mit Betreuer → +50 XP</li>
            <li>✓ <strong>Team-Code merken:</strong> Zum Einloggen auf anderen Geräten</li>
            <li>✓ <strong>Chat nutzen:</strong> Bei Fragen den Admin fragen</li>
          </ul>
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="w-full bg-amber-700 hover:bg-amber-800 text-white font-black text-lg py-4 rounded-2xl shadow-lg active:scale-95 transition-all"
        >
          Jetzt anmelden! 🚀
        </button>
      </div>

      {/* Footer */}
      <p className="text-amber-300 text-xs mt-8 text-center max-w-md">
        Viel Spaß beim Spielen! Bei Fragen könnt ihr den Admin im Chat fragen.
      </p>
    </div>
  );
}
