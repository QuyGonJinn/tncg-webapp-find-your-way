import { useState, useEffect } from 'react';
import { STATIONS } from '../../data/stations';

export default function StationCodes() {
  const [codes, setCodes] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [saved, setSaved] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/stations/codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stationId: editingId, code: editValue.toUpperCase() }),
      });
      
      if (response.ok) {
        setCodes(prev => ({ ...prev, [editingId]: editValue.toUpperCase() }));
        setModalOpen(false);
        setEditingId(null);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error('Error saving code:', error);
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    setEditingId(null);
    setEditValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  return (
    <div className="space-y-6">
      {saved && (
        <div className="bg-green-50 border-2 border-green-400 rounded-2xl p-4 animate-pulse">
          <p className="text-green-800 font-bold text-center">✅ Code gespeichert!</p>
        </div>
      )}

      {/* Passive Stationen */}
      <div>
        <h2 className="text-amber-900 font-black text-xl mb-2">🌊 Passive Stationen</h2>
        <p className="text-stone-600 text-sm mb-4">Klick auf einen Code um ihn zu bearbeiten</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {passiveStations.map(s => (
            <div
              key={s.id}
              className="bg-gradient-to-br from-amber-50 to-stone-50 border-2 border-amber-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{s.emoji}</span>
                  <div>
                    <h3 className="font-black text-amber-900 text-lg">{s.title}</h3>
                    <p className="text-xs text-amber-700 font-semibold">+20 XP</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => handleEdit(s.id, codes[s.id] || s.code)}
                className="bg-white border-2 border-amber-300 rounded-xl px-4 py-3 cursor-pointer hover:bg-amber-50 transition-all text-center"
              >
                <p className="text-xs text-stone-500 font-semibold mb-1">Code</p>
                <p className="font-black text-3xl text-amber-700 tracking-widest">{codes[s.id] || s.code}</p>
                <p className="text-xs text-amber-600 font-semibold mt-2">Klick zum Bearbeiten</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Aktive Stationen */}
      <div>
        <h2 className="text-orange-700 font-black text-xl mb-2">⚡ Aktive Stationen</h2>
        <p className="text-stone-600 text-sm mb-4">Diese brauchen keinen Code</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeStations.map(s => (
            <div
              key={s.id}
              className="bg-gradient-to-br from-orange-50 to-stone-50 border-2 border-orange-200 rounded-2xl p-6 shadow-md"
            >
              <div className="flex items-center gap-3">
                <span className="text-4xl">{s.emoji}</span>
                <div>
                  <h3 className="font-black text-orange-900 text-lg">{s.title}</h3>
                  <p className="text-xs text-orange-700 font-semibold">+50 XP • Betreuer vor Ort</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tipp */}
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-4">
        <p className="text-yellow-800 text-sm">
          <span className="font-bold">💡 Tipp:</span> Druckt die Codes aus und legt sie bei den passiven Stationen aus. Teams müssen die Aufgabe lösen um den Code zu finden.
        </p>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full border-2 border-amber-300">
            <h3 className="text-amber-900 font-black text-2xl mb-6">Code bearbeiten</h3>
            
            <div className="mb-6">
              <label className="block text-amber-900 font-bold mb-3">Neuer Code:</label>
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                maxLength="6"
                className="w-full border-2 border-amber-300 rounded-2xl px-4 py-3 text-3xl font-black text-center text-amber-700 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-200"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 bg-amber-700 hover:bg-amber-800 text-white font-black py-3 rounded-2xl transition-all active:scale-95"
              >
                ✓ Speichern
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 border-2 border-stone-300 text-stone-600 font-black py-3 rounded-2xl hover:bg-stone-50 transition-all active:scale-95"
              >
                ✕ Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
