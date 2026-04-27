import { STATIONS } from '../../data/stations';

export default function StationCodes() {
  const passiveStations = STATIONS.filter(s => s.type === 'passiv');
  const activeStations = STATIONS.filter(s => s.type === 'aktiv');

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-blue-700 font-black text-lg mb-3">🌊 Passive Stationen (Code-Eingabe)</h2>
        <p className="text-slate-500 text-sm mb-4">Diese Codes müssen an den Stationen ausgelegt werden. Teams geben sie in der App ein.</p>
        <div className="grid gap-2">
          {passiveStations.map(s => (
            <div key={s.id} className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{s.emoji}</span>
                <span className="font-bold text-slate-800">{s.title}</span>
              </div>
              <div className="bg-white border-2 border-blue-300 rounded-lg px-4 py-2">
                <span className="font-black text-2xl text-blue-700 tracking-widest select-all">{s.code}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-orange-600 font-black text-lg mb-3">⚡ Aktive Stationen (Admin-Bestätigung)</h2>
        <p className="text-slate-500 text-sm mb-4">Diese Stationen brauchen keinen Code — ihr bestätigt sie manuell im Dashboard.</p>
        <div className="grid gap-2">
          {activeStations.map(s => (
            <div key={s.id} className="flex items-center gap-2 bg-orange-50 rounded-xl px-4 py-3">
              <span className="text-2xl">{s.emoji}</span>
              <span className="font-bold text-slate-800">{s.title}</span>
              <span className="ml-auto text-orange-600 text-sm font-semibold">Betreuer vor Ort</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-4">
        <p className="text-yellow-800 text-sm">
          <span className="font-bold">💡 Tipp:</span> Druckt die Codes aus und legt sie bei den passiven Stationen aus. Teams müssen die Aufgabe lösen um den Code zu finden.
        </p>
      </div>
    </div>
  );
}
