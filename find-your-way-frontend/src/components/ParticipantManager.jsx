import { useState } from 'react';
import { addParticipant, updateParticipant, deleteParticipant } from '../api';

export default function ParticipantManager({ teamId, participants, onUpdate }) {
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const MAX_PARTICIPANTS = 6;
  const isFull = participants.length >= MAX_PARTICIPANTS;

  async function handleAdd(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      await addParticipant(teamId, newName);
      setNewName('');
      onUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(participantId) {
    if (!editingName.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      await updateParticipant(teamId, participantId, editingName);
      setEditingId(null);
      setEditingName('');
      onUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(participantId) {
    if (!confirm('Teilnehmer wirklich löschen?')) return;
    
    setLoading(true);
    setError('');
    try {
      await deleteParticipant(teamId, participantId);
      onUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      {/* Add Participant Form */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="Name eingeben..."
          maxLength={30}
          disabled={isFull || loading}
          className="flex-1 border-2 border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={!newName.trim() || isFull || loading}
          className="bg-blue-600 disabled:bg-gray-300 text-white font-bold px-4 py-2 rounded-lg text-sm active:scale-95 transition-transform"
        >
          {loading ? '...' : '➕'}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <p className="text-red-600 text-sm font-semibold bg-red-50 p-2 rounded-lg">{error}</p>
      )}

      {/* Participant List */}
      <div className="space-y-2">
        {participants.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-3">Keine Teilnehmer hinzugefügt</p>
        ) : (
          participants.map((participant, idx) => (
            <div key={participant.id} className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
              <span className="text-sm font-bold text-gray-500 w-6">{idx + 1}.</span>
              
              {editingId === participant.id ? (
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                    maxLength={30}
                    className="flex-1 border-2 border-blue-400 rounded px-2 py-1 text-sm focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => handleUpdate(participant.id)}
                    disabled={loading}
                    className="bg-green-600 disabled:bg-gray-300 text-white font-bold px-2 py-1 rounded text-xs"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-400 text-white font-bold px-2 py-1 rounded text-xs"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm font-semibold text-slate-800">{participant.name}</span>
                  <button
                    onClick={() => {
                      setEditingId(participant.id);
                      setEditingName(participant.name);
                    }}
                    className="text-blue-600 hover:text-blue-800 font-bold text-sm"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(participant.id)}
                    className="text-red-600 hover:text-red-800 font-bold text-sm"
                  >
                    🗑️
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Capacity Indicator */}
      <div className="flex items-center gap-2 text-xs text-gray-600">
        <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-blue-600 h-1.5 rounded-full transition-all"
            style={{ width: `${(participants.length / MAX_PARTICIPANTS) * 100}%` }}
          />
        </div>
        <span className="font-bold">{participants.length}/{MAX_PARTICIPANTS}</span>
      </div>
    </div>
  );
}
