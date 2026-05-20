import { useState, useEffect } from 'react';
import { loginWithPin, fetchTeam } from '../api';
import { useI18n } from '../hooks/useI18n';

function LoginScreen({ onLogin, error }) {
  const { t, language, switchLanguage } = useI18n();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(error);

  async function handleLogin() {
    if (!pin) return;
    setLoading(true);
    try {
      const team = await loginWithPin(pin);
      onLogin(team);
    } catch (e) {
      setLoginError(e.message || t('heiligeBuchstabenjagd.loginError'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 via-indigo-800 to-indigo-900 flex flex-col items-center justify-center p-6">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => switchLanguage('de')}
          className={`px-3 py-1 rounded-lg font-bold text-sm transition-all ${
            language === 'de'
              ? 'bg-purple-500 text-white'
              : 'bg-indigo-700 text-purple-200 hover:bg-indigo-600'
          }`}
        >
          DE
        </button>
        <button
          onClick={() => switchLanguage('en')}
          className={`px-3 py-1 rounded-lg font-bold text-sm transition-all ${
            language === 'en'
              ? 'bg-purple-500 text-white'
              : 'bg-indigo-700 text-purple-200 hover:bg-indigo-600'
          }`}
        >
          EN
        </button>
      </div>

      {/* Logo & Title */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-3 animate-bounce">📜</div>
        <h1 className="text-4xl font-black text-purple-100 tracking-tight">{t('heiligeBuchstabenjagd.title')}</h1>
        <p className="text-purple-300 mt-2 text-lg">{t('heiligeBuchstabenjagd.subtitle')}</p>
      </div>

      {/* Login Card */}
      <div className="bg-purple-50 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border-2 border-purple-300 p-8">
        <div className="text-center mb-6">
          <p className="text-indigo-700 text-sm leading-relaxed">
            {t('heiligeBuchstabenjagd.loginDescription')}
          </p>
        </div>

        {loginError && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-3 mb-4">
            <p className="text-red-700 text-sm font-bold">⚠️ {loginError}</p>
          </div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder={t('setup.pinPlaceholder')}
            className="w-full border-2 border-purple-200 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:border-purple-500"
            disabled={loading}
          />

          <button
            onClick={handleLogin}
            disabled={loading || !pin}
            className="w-full bg-purple-700 hover:bg-purple-800 disabled:bg-gray-400 text-white font-black text-lg py-4 rounded-2xl shadow-lg active:scale-95 transition-all"
          >
            {loading ? t('heiligeBuchstabenjagd.loginLoading') : t('heiligeBuchstabenjagd.loginButton')}
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          {t('heiligeBuchstabenjagd.pinReminder')}
        </p>
      </div>
    </div>
  );
}

function GameScreen({ team, onLogout }) {
  const { t, language, switchLanguage } = useI18n();
  const [photo, setPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [submissionId, setSubmissionId] = useState(null);
  const [submissionCode, setSubmissionCode] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState('pending');
  const [rejectionMessage, setRejectionMessage] = useState(null);

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!submissionId) return;

    console.log('🔌 Connecting WebSocket for submission:', submissionId);
    
    // Construct WebSocket URL - use backend directly, not through Nginx
    let wsBase = import.meta.env.VITE_WS_URL ?? 'ws://localhost:3001';
    
    // If VITE_WS_URL is wss://, convert to ws:// for local development
    // In production, wss:// should work through Nginx
    if (wsBase.startsWith('wss://')) {
      // For production with Nginx, we need to use the same domain
      wsBase = wsBase; // Keep as is, Nginx will handle it
    }
    
    console.log('📡 WebSocket URL:', wsBase);
    const ws = new WebSocket(wsBase);

    ws.onopen = () => {
      console.log('✅ WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const { type, payload } = JSON.parse(event.data);
        console.log('📨 WebSocket message:', type, payload);
        
        if (type === 'heiligeBuchstabenjagd:confirmed' && payload.submissionId === submissionId) {
          console.log('✅ Submission confirmed!', payload);
          setSubmissionCode(payload.code);
          setSubmissionStatus('confirmed');
        }
        
        if (type === 'heiligeBuchstabenjagd:rejected' && payload.submissionId === submissionId) {
          console.log('❌ Submission rejected!', payload);
          setSubmissionStatus('rejected');
          setRejectionMessage(t('heiligeBuchstabenjagd.rejectedMessage'));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('🔌 WebSocket closed');
    };

    return () => {
      console.log('🔌 Closing WebSocket');
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [submissionId, t]);

  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('teamId', team.id);

      const apiBase = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3001'}/api`;
      const response = await fetch(`${apiBase}/heilige-buchstabenjagd/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(t('heiligeBuchstabenjagd.uploadError'));
      }

      const data = await response.json();
      setPhoto(file);
      setSubmissionId(data.submissionId);
      setSubmissionStatus('pending');
      setSubmitted(true);
    } catch (error) {
      setUploadError(error.message || t('heiligeBuchstabenjagd.uploadError'));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-purple-100 px-4 pt-6 pb-4 shadow-lg sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl">📜</span>
            <div>
              <h1 className="text-2xl font-black leading-tight text-purple-50">{t('heiligeBuchstabenjagd.title')}</h1>
              <p className="text-purple-300 text-sm">{t('heiligeBuchstabenjagd.subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <button
                onClick={() => switchLanguage('de')}
                className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                  language === 'de'
                    ? 'bg-purple-500 text-white'
                    : 'bg-indigo-700 text-purple-200 hover:bg-indigo-600'
                }`}
              >
                DE
              </button>
              <button
                onClick={() => switchLanguage('en')}
                className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                  language === 'en'
                    ? 'bg-purple-500 text-white'
                    : 'bg-indigo-700 text-purple-200 hover:bg-indigo-600'
                }`}
              >
                EN
              </button>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1 rounded-lg text-sm"
            >
              {t('common.logout')}
            </button>
          </div>
        </div>

        {/* Team Info */}
        <div className="bg-indigo-800/50 rounded-xl px-3 py-2">
          <p className="text-purple-300 text-sm font-bold">
            {team.icon} {team.name}
          </p>
        </div>
      </div>

      <div className="px-4 py-6 max-w-4xl mx-auto">
        {!submitted ? (
          <>
            {/* Instructions */}
            <div className="bg-purple-100 border-2 border-purple-300 rounded-2xl p-6 mb-8">
              <p className="text-purple-900 font-bold text-lg mb-4">{t('heiligeBuchstabenjagd.instructions')}</p>
              <div className="text-purple-900 text-sm space-y-3">
                <p>{t('heiligeBuchstabenjagd.step1')}</p>
                <p>{t('heiligeBuchstabenjagd.step2')}</p>
                <p>{t('heiligeBuchstabenjagd.step3')}</p>
              </div>
            </div>

            {/* Photo Upload */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
              <h3 className="text-xl font-black text-purple-900 mb-4">{t('heiligeBuchstabenjagd.uploadPhoto')}</h3>
              
              {uploadError && (
                <div className="bg-red-50 border-2 border-red-300 rounded-xl p-3 mb-4">
                  <p className="text-red-700 text-sm font-bold">⚠️ {uploadError}</p>
                </div>
              )}

              <div className="space-y-4">
                <label className="block">
                  <div className="border-2 border-dashed border-purple-300 rounded-2xl p-8 text-center cursor-pointer hover:bg-purple-50 transition-all">
                    <span className="text-4xl block mb-2">📸</span>
                    <p className="text-purple-900 font-bold">{t('heiligeBuchstabenjagd.choosePhoto')}</p>
                    <p className="text-stone-500 text-sm mt-1">{t('heiligeBuchstabenjagd.photoHint')}</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>

                {photo && (
                  <div className="bg-green-50 border-2 border-green-300 rounded-xl p-3">
                    <p className="text-green-700 font-bold">✅ {t('heiligeBuchstabenjagd.photoSelected')}</p>
                  </div>
                )}

                <button
                  disabled={!photo || uploading}
                  className="w-full bg-purple-700 hover:bg-purple-800 disabled:bg-gray-400 text-white font-black text-lg py-4 rounded-2xl shadow-lg active:scale-95 transition-all"
                >
                  {uploading ? t('heiligeBuchstabenjagd.uploading') : t('heiligeBuchstabenjagd.submitPhoto')}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Submitted State */
          <div className="bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-400 rounded-2xl p-8 shadow-lg text-center">
            {submissionStatus === 'confirmed' ? (
              <>
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-3xl font-black text-green-700 mb-2">{t('heiligeBuchstabenjagd.submitted')}</h2>
                <p className="text-green-700 text-lg mb-6">{t('heiligeBuchstabenjagd.codeReceived')}</p>
                
                <div className="bg-white rounded-xl p-4 border-2 border-green-400 mb-6">
                  <p className="text-green-700 font-bold text-sm mb-2">🎉 {t('heiligeBuchstabenjagd.code')}:</p>
                  <p className="text-4xl font-black text-green-700 tracking-widest">{submissionCode}</p>
                </div>
                
                <button
                  onClick={() => {
                    setPhoto(null);
                    setSubmitted(false);
                    setUploadError(null);
                    setSubmissionId(null);
                    setSubmissionCode(null);
                    setSubmissionStatus('pending');
                    setRejectionMessage(null);
                  }}
                  className="bg-green-700 hover:bg-green-800 text-white font-black px-6 py-3 rounded-2xl"
                >
                  {t('heiligeBuchstabenjagd.submitAnother')}
                </button>
              </>
            ) : submissionStatus === 'rejected' ? (
              <>
                <div className="text-6xl mb-4">❌</div>
                <h2 className="text-3xl font-black text-red-700 mb-2">{t('heiligeBuchstabenjagd.rejected')}</h2>
                <p className="text-red-700 text-lg mb-6">{rejectionMessage}</p>
                
                <button
                  onClick={() => {
                    setPhoto(null);
                    setSubmitted(false);
                    setUploadError(null);
                    setSubmissionId(null);
                    setSubmissionCode(null);
                    setSubmissionStatus('pending');
                    setRejectionMessage(null);
                  }}
                  className="bg-red-700 hover:bg-red-800 text-white font-black px-6 py-3 rounded-2xl"
                >
                  {t('heiligeBuchstabenjagd.tryAgain')}
                </button>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4 animate-spin">⏳</div>
                <h2 className="text-3xl font-black text-green-700 mb-2">{t('heiligeBuchstabenjagd.submitted')}</h2>
                <p className="text-green-700 text-lg mb-2">{t('heiligeBuchstabenjagd.waitingConfirmation')}</p>
                <p className="text-green-600 text-sm">{t('heiligeBuchstabenjagd.adminWillConfirm')}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HeiligeBuchstabenjagdPage() {
  const { t } = useI18n();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedTeamId = localStorage.getItem('fyw_heilige_buchstabenjagd_team_id');
    if (savedTeamId) {
      fetchTeam(savedTeamId)
        .then(t => setTeam(t))
        .catch(() => localStorage.removeItem('fyw_heilige_buchstabenjagd_team_id'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  function handleLogin(teamData) {
    localStorage.setItem('fyw_heilige_buchstabenjagd_team_id', teamData.id);
    setTeam(teamData);
  }

  function handleLogout() {
    localStorage.removeItem('fyw_heilige_buchstabenjagd_team_id');
    setTeam(null);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <p className="text-gray-500">{t('common.loading')}</p>
      </div>
    );
  }

  return team ? (
    <GameScreen team={team} onLogout={handleLogout} />
  ) : (
    <LoginScreen onLogin={handleLogin} />
  );
}
