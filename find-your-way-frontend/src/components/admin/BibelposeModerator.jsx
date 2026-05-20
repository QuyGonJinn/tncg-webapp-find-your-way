import { useState, useEffect } from 'react';
import { useI18n } from '../../hooks/useI18n';

export default function BibelposeModerator() {
  const { t } = useI18n();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [code, setCode] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState(null);
  const [stationCode, setStationCode] = useState('');

  // Load station code for Bibelpose (station 11)
  useEffect(() => {
    loadStationCode();
  }, []);

  async function loadStationCode() {
    try {
      const apiBase = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3001'}/api`;
      const response = await fetch(`${apiBase}/stations/codes`);
      const codes = await response.json();
      // Station 11 is Bibelpose
      if (codes[11]) {
        setStationCode(codes[11]);
      }
    } catch (err) {
      console.error('Error loading station code:', err);
    }
  }

  function handleSelectSubmission(submission) {
    setSelectedSubmission(submission);
    // Set code from station code when selecting a submission
    if (submission.status === 'pending') {
      setCode(stationCode);
    } else {
      setCode(submission.code || '');
    }
  }

  useEffect(() => {
    loadSubmissions();
    // Refresh every 5 seconds
    const interval = setInterval(loadSubmissions, 5000);
    return () => clearInterval(interval);
  }, []);

  async function loadSubmissions() {
    try {
      const apiBase = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3001'}/api`;
      const response = await fetch(`${apiBase}/bibelpose/submissions`);
      const data = await response.json();
      setSubmissions(data);
    } catch (err) {
      console.error('Error loading submissions:', err);
      setError('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    if (!selectedSubmission || !code) return;

    setConfirming(true);
    try {
      const apiBase = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3001'}/api`;
      const response = await fetch(`${apiBase}/bibelpose/submissions/${selectedSubmission.id}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) throw new Error('Failed to confirm');

      setCode('');
      setSelectedSubmission(null);
      loadSubmissions();
    } catch (err) {
      setError(err.message);
    } finally {
      setConfirming(false);
    }
  }

  async function handleReject() {
    if (!selectedSubmission) return;

    if (!confirm(t('bibelpose.confirmReject'))) return;

    try {
      const apiBase = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3001'}/api`;
      const response = await fetch(`${apiBase}/bibelpose/submissions/${selectedSubmission.id}/reject`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to reject');

      setSelectedSubmission(null);
      loadSubmissions();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    if (!selectedSubmission) return;

    if (!confirm('Möchtest du diese Einreichung wirklich löschen? Das Foto wird auch gelöscht.')) return;

    try {
      const apiBase = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3001'}/api`;
      const response = await fetch(`${apiBase}/bibelpose/submissions/${selectedSubmission.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      setSelectedSubmission(null);
      loadSubmissions();
    } catch (err) {
      setError(err.message);
    }
  }

  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const confirmedCount = submissions.filter(s => s.status === 'confirmed').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-amber-900">🎭 {t('bibelpose.moderationTitle')}</h2>
        <button
          onClick={loadSubmissions}
          className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-4 py-2 rounded-lg"
        >
          🔄 {t('bibelpose.refresh')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-amber-100 border-2 border-amber-300 rounded-2xl p-4 text-center">
          <p className="text-amber-900 font-bold text-sm">{t('bibelpose.pending')}</p>
          <p className="text-4xl font-black text-amber-700">{pendingCount}</p>
        </div>
        <div className="bg-green-100 border-2 border-green-300 rounded-2xl p-4 text-center">
          <p className="text-green-900 font-bold text-sm">{t('bibelpose.confirmed')}</p>
          <p className="text-4xl font-black text-green-700">{confirmedCount}</p>
        </div>
        <div className="bg-stone-100 border-2 border-stone-300 rounded-2xl p-4 text-center">
          <p className="text-stone-900 font-bold text-sm">{t('bibelpose.total')}</p>
          <p className="text-4xl font-black text-stone-700">{submissions.length}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
          <p className="text-red-700 font-bold">⚠️ {error}</p>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500">{t('common.loading')}</p>
      ) : submissions.length === 0 ? (
        <p className="text-center text-gray-500">{t('bibelpose.noSubmissions')}</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submissions List */}
          <div className="lg:col-span-1 space-y-2 max-h-96 overflow-y-auto">
            {submissions.map(submission => (
              <button
                key={submission.id}
                onClick={() => handleSelectSubmission(submission)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selectedSubmission?.id === submission.id
                    ? 'bg-amber-500 border-amber-700 text-white'
                    : submission.status === 'confirmed'
                    ? 'bg-green-50 border-green-300 text-stone-800'
                    : 'bg-white border-amber-200 text-stone-800 hover:border-amber-400'
                }`}
              >
                <p className="font-bold">{submission.team_name}</p>
                <p className="text-sm opacity-75">{submission.scene_name}</p>
                <p className="text-xs mt-1">
                  {submission.status === 'confirmed' ? '✅ Bestätigt' : '⏳ Ausstehend'}
                </p>
              </button>
            ))}
          </div>

          {/* Detail View */}
          {selectedSubmission && (
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border-2 border-amber-200">
              <div className="mb-6">
                <h3 className="text-xl font-black text-amber-900 mb-2">{selectedSubmission.team_name}</h3>
                <p className="text-stone-600 mb-4">
                  <strong>{t('bibelpose.scene')}:</strong> {selectedSubmission.scene_name}
                </p>

                {/* Photo Preview */}
                <div className="mb-6">
                  <img
                    src={`${import.meta.env.VITE_API_URL ?? 'http://localhost:3001'}/data/${selectedSubmission.photo_path}`}
                    alt={selectedSubmission.scene_name}
                    className="w-full rounded-xl border-2 border-amber-200 max-h-64 object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="24"%3EBild konnte nicht geladen werden%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>

                {/* Status */}
                <div className="mb-6">
                  <p className="text-sm font-bold text-stone-600 mb-2">{t('bibelpose.status')}:</p>
                  <div className={`inline-block px-4 py-2 rounded-lg font-bold ${
                    selectedSubmission.status === 'confirmed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedSubmission.status === 'confirmed' ? '✅ Bestätigt' : '⏳ Ausstehend'}
                  </div>
                </div>

                {/* Code Input (only for pending) */}
                {selectedSubmission.status === 'pending' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-2">
                        {t('bibelpose.enterCode')}
                      </label>
                      <div className="bg-amber-50 border-2 border-amber-300 rounded-xl px-4 py-3 font-bold text-lg">
                        {code || '⚠️ Kein Code definiert'}
                      </div>
                      <p className="text-xs text-stone-500 mt-2">
                        {code ? 'Code aus Station-Codes übernommen' : 'Bitte definieren Sie einen Code im Station-Codes Tab'}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleConfirm}
                        disabled={!code || confirming}
                        className="flex-1 bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white font-black py-3 rounded-xl"
                      >
                        {confirming ? '⏳ ' + t('common.loading') : '✅ ' + t('bibelpose.confirm')}
                      </button>
                      <button
                        onClick={handleReject}
                        className="flex-1 bg-red-700 hover:bg-red-800 text-white font-black py-3 rounded-xl"
                      >
                        ❌ {t('bibelpose.reject')}
                      </button>
                    </div>
                  </div>
                )}

                {/* Show code if confirmed */}
                {selectedSubmission.status === 'confirmed' && selectedSubmission.code && (
                  <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 mb-4">
                    <p className="text-green-700 font-bold text-sm mb-2">🎉 {t('bibelpose.codeAssigned')}:</p>
                    <p className="text-3xl font-black text-green-700 tracking-widest">{selectedSubmission.code}</p>
                  </div>
                )}

                {/* Delete button for confirmed submissions */}
                {selectedSubmission.status === 'confirmed' && (
                  <button
                    onClick={handleDelete}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-xl"
                  >
                    🗑️ Löschen
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
