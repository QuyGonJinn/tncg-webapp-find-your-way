import { useState, useEffect } from 'react';
import { STATIONS } from '../../data/stations';

export default function StationCodes() {
  const [codes, setCodes] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [saved, setSaved] = useState(false);

  const passiveStations = STATIONS.filter(s => s.type === 'passiv');
  const activeStations = STATIONS.filter(s => s.type === 'aktiv');

  // Load codes from backend on mount
  useEffect(() => {
    const loadCodes = async () => {
      try {
        const response = await fetch('/api/stations/codes');
        const data = await response.json();
        setCodes(data);
      } catch (error) {
        console.error('Error loading codes:', error);
        // Fallback to default codes
        const defaultCodes = {};
        passiveStations.forEach(s => {
          defaultCodes[s.id] = s.code;
        });
        setCodes(defaultCodes);
      }
    };
    loadCodes();
  }, []);

  const handleEdit = (stationId, currentCode) => {
    setEditingId(stationId);
    setEditValue(currentCode || '');
  };

  const handleSave = async (stationId) => {
    try {
      const response = await fetch('/api/stations/codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stationId, code: editValue.toUpperCase() }),
      });
      
      if (response.ok) {
        setCodes(prev => ({ ...prev, [stationId]: editValue.toUpperCase() }));
        setEditingId(null);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error('Error saving code:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  return (
    <div className="space-y-4">
      {saved && (
        <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-4">
          <p className="text-green-800 font-bold">✅ Code gespeichert!</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-blue-700 font-black text-lg mb-3">🌊 Passive Stationen (Code-Eingabe)</h2>
        <p className="text-slate-500 text-sm mb-4">Diese Codes müssen an den Stationen ausgelegt werden. Teams geben sie in der App ein. Klick auf einen Code um ihn zu bearbeiten.</p>
        <div className="grid gap-2">
          {passiveStations.map(s => (
            <div key={s.id} className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{s.emoji}</span>
                <span className="font-bold text-slate-800">{s.title}</span>
              </div>
              
              {editingId === s.id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value.toUpperCase())}
                    maxLength="6"
                    className="border-2 border-blue-300 rounded-lg px-3 py-2 font-black text-lg text-center focus:outline-none focus:border-blue-600"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSave(s.id)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-2 rounded-lg transition-all"
                  >
                    ✓
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-2 rounded-lg transition-all"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => handleEdit(s.id, codes[s.id] || s.code)}
                  className="bg-white border-2 border-blue-300 rounded-lg px-4 py-2 cursor-pointer hover:bg-blue-100 transition-all"
                >
                  <span className="font-black text-2xl text-blue-700 tracking-widest select-all">{codes[s.id] || s.code}</span>
                </div>
              )}
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
