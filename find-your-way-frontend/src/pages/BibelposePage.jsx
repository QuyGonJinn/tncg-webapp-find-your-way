import { useState, useEffect } from 'react';
import { loginWithPin, fetchTeam } from '../api';
import { useI18n } from '../hooks/useI18n';

// 20 biblische Szenen für Standbilder
const BIBLICAL_SCENES = [
  { id: 1, title: 'Lots Frau', people: '2–4 Personen' },
  { id: 2, title: 'David gegen Goliath', people: '2 Personen' },
  { id: 3, title: 'Moses teilt das Meer', people: 'ganzes Team' },
  { id: 4, title: 'Adam und Eva', people: '2–3 Personen' },
  { id: 5, title: 'Jesus geht über Wasser', people: '2–3 Personen' },
  { id: 6, title: 'Garten Gethsemane', people: '3–4 Personen' },
  { id: 7, title: 'Kain und Abel', people: '2–3 Personen' },
  { id: 8, title: 'Die Zehn Gebote', people: '1–2 Personen' },
  { id: 9, title: 'Jesus heilt einen Blinden/Gelähmten', people: '2–3 Personen' },
  { id: 10, title: 'Einzug nach Jerusalem (Palmsonntag)', people: 'ganzes Team' },
  { id: 11, title: 'Das letzte Abendmahl', people: 'alle' },
  { id: 12, title: 'Jesus wäscht den Jüngern die Füße', people: 'alle' },
  { id: 13, title: 'Maria trocknet Jesus die Füße mit ihren Haaren', people: '3 Personen' },
  { id: 14, title: 'Judas verrät Jesus', people: '3–alle' },
  { id: 15, title: 'Jesus wird gefangen genommen', people: 'alle' },
  { id: 16, title: 'Steinigung', people: 'alle' },
  { id: 17, title: 'Samson verliert seine Kraft', people: '2 Personen' },
  { id: 18, title: 'Jesus verflucht den Baum', people: '1–2 Personen' },
  { id: 19, title: 'Beten', people: '1–alle' },
  { id: 20, title: 'Bibel lesen', people: '1–2 Personen' },
];

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
      setLoginError(e.message || t('bibelpose.loginError'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-800 via-stone-800 to-stone-900 flex flex-col items-center justify-center p-6">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => switchLanguage('de')}
          className={`px-3 py-1 rounded-lg font-bold text-sm transition-all ${
            language === 'de'
              ? 'bg-amber-500 text-white'
              : 'bg-stone-700 text-amber-200 hover:bg-stone-600'
          }`}
        >
          DE
        </button>
        <button
          onClick={() => switchLanguage('en')}
          className={`px-3 py-1 rounded-lg font-bold text-sm transition-all ${
            language === 'en'
              ? 'bg-amber-500 text-white'
              : 'bg-stone-700 text-amber-200 hover:bg-stone-600'
          }`}
        >
          EN
        </button>
      </div>

      {/* Logo & Title */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-3 animate-bounce">🎭</div>
        <h1 className="text-4xl font-black text-amber-100 tracking-tight">{t('bibelpose.title')}</h1>
        <p className="text-amber-300 mt-2 text-lg">{t('bibelpose.subtitle')}</p>
      </div>

      {/* Login Card */}
      <div className="bg-amber-50 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border-2 border-amber-300 p-8">
        <div className="text-center mb-6">
          <p className="text-stone-700 text-sm leading-relaxed">
            {t('bibelpose.loginDescription')}
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
            className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:border-amber-500"
            disabled={loading}
          />

          <button
            onClick={handleLogin}
            disabled={loading || !pin}
            className="w-full bg-amber-700 hover:bg-amber-800 disabled:bg-gray-400 text-white font-black text-lg py-4 rounded-2xl shadow-lg active:scale-95 transition-all"
          >
            {loading ? t('bibelpose.loginLoading') : t('bibelpose.loginButton')}
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          {t('bibelpose.pinReminder')}
        </p>
      </div>
    </div>
  );
}

function GameScreen({ team, onLogout }) {
  const { t, language, switchLanguage } = useI18n();
  const [selectedScene, setSelectedScene] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [submissionId, setSubmissionId] = useState(null);
  const [submissionCode, setSubmissionCode] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState('pending'); // 'pending', 'confirmed', 'rejected'
  const [rejectionMessage, setRejectionMessage] = useState(null);

  // Poll for submission status updates
  useEffect(() => {
    if (!submissionId || submissionStatus !== 'pending') return;

    console.log('⏱️ Starting status polling for submission:', submissionId);
    
    const pollInterval = setInterval(async () => {
      try {
        const apiBase = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3001'}/api`;
        const response = await fetch(`${apiBase}/bibelpose/submissions/${submissionId}/status`);
        const data = await response.json();
        
        console.log('📊 Status check:', data.status);
        
        if (data.status === 'confirmed') {
          console.log('✅ Submission confirmed!', data);
          setSubmissionCode(data.code);
          setSubmissionStatus('confirmed');
          clearInterval(pollInterval);
        } else if (data.status === 'rejected') {
          console.log('❌ Submission rejected!');
          setSubmissionStatus('rejected');
          setRejectionMessage(t('bibelpose.rejectedMessage'));
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error('Error checking status:', error);
      }
    }, 2000); // Check every 2 seconds

    return () => clearInterval(pollInterval);
  }, [submissionId]);

  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('teamId', team.id);
      formData.append('sceneId', selectedScene.id);
      formData.append('sceneName', selectedScene.title);

      const apiBase = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3001'}/api`;
      const response = await fetch(`${apiBase}/bibelpose/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(t('bibelpose.uploadError'));
      }

      const data = await response.json();
      setPhoto(file);
      setSubmissionId(data.submissionId);
      setSubmissionStatus('pending');
      setSubmitted(true);
    } catch (error) {
      setUploadError(error.message || t('bibelpose.uploadError'));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-900 to-amber-900 text-amber-100 px-4 pt-6 pb-4 shadow-lg sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🎭</span>
            <div>
              <h1 className="text-2xl font-black leading-tight text-amber-50">{t('bibelpose.title')}</h1>
              <p className="text-amber-300 text-sm">{t('bibelpose.subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <button
                onClick={() => switchLanguage('de')}
                className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                  language === 'de'
                    ? 'bg-amber-500 text-white'
                    : 'bg-stone-700 text-amber-200 hover:bg-stone-600'
                }`}
              >
                DE
              </button>
              <button
                onClick={() => switchLanguage('en')}
                className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                  language === 'en'
                    ? 'bg-amber-500 text-white'
                    : 'bg-stone-700 text-amber-200 hover:bg-stone-600'
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
        <div className="bg-stone-800/50 rounded-xl px-3 py-2">
          <p className="text-amber-300 text-sm font-bold">
            {team.icon} {team.name}
          </p>
        </div>
      </div>

      <div className="px-4 py-6 max-w-4xl mx-auto">
        {!submitted ? (
          <>
            {/* Instructions */}
            <div className="bg-amber-100 border-2 border-amber-300 rounded-2xl p-6 mb-8">
              <p className="text-amber-900 font-bold text-lg mb-4">{t('bibelpose.instructions')}</p>
              <div className="text-amber-900 text-sm space-y-3">
                <p>{t('bibelpose.step1')}</p>
                <p>{t('bibelpose.step2')}</p>
                <p>{t('bibelpose.step3')}</p>
                <p>{t('bibelpose.step4')}</p>
              </div>
            </div>

            {/* Scene Selection */}
            <div className="mb-8">
              <h2 className="text-2xl font-black text-amber-900 mb-4">{t('bibelpose.selectScene')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {BIBLICAL_SCENES.map(scene => (
                  <button
                    key={scene.id}
                    onClick={() => setSelectedScene(scene)}
                    className={`p-4 rounded-2xl border-2 transition-all text-left ${
                      selectedScene?.id === scene.id
                        ? 'bg-amber-500 border-amber-700 text-white shadow-lg'
                        : 'bg-white border-amber-200 text-stone-800 hover:border-amber-400'
                    }`}
                  >
                    <p className="font-black text-lg">{scene.title}</p>
                    <p className="text-sm mt-1 opacity-75">{scene.people}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Upload */}
            {selectedScene && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-amber-200">
                <h3 className="text-xl font-black text-amber-900 mb-4">{t('bibelpose.uploadPhoto')}</h3>
                
                {uploadError && (
                  <div className="bg-red-50 border-2 border-red-300 rounded-xl p-3 mb-4">
                    <p className="text-red-700 text-sm font-bold">⚠️ {uploadError}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <label className="block">
                    <div className="border-2 border-dashed border-amber-300 rounded-2xl p-8 text-center cursor-pointer hover:bg-amber-50 transition-all">
                      <span className="text-4xl block mb-2">📸</span>
                      <p className="text-amber-900 font-bold">{t('bibelpose.choosePhoto')}</p>
                      <p className="text-stone-500 text-sm mt-1">{t('bibelpose.photoHint')}</p>
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
                      <p className="text-green-700 font-bold">✅ {t('bibelpose.photoSelected')}</p>
                    </div>
                  )}

                  <button
                    disabled={!photo || uploading}
                    className="w-full bg-amber-700 hover:bg-amber-800 disabled:bg-gray-400 text-white font-black text-lg py-4 rounded-2xl shadow-lg active:scale-95 transition-all"
                  >
                    {uploading ? t('bibelpose.uploading') : t('bibelpose.submitPhoto')}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Submitted State */
          <div className="bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-400 rounded-2xl p-8 shadow-lg text-center">
            {submissionStatus === 'confirmed' ? (
              <>
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-3xl font-black text-green-700 mb-2">{t('bibelpose.submitted')}</h2>
                <p className="text-green-700 text-lg mb-6">{t('bibelpose.codeReceived')}</p>
                
                <div className="bg-white rounded-xl p-4 border-2 border-green-400 mb-6">
                  <p className="text-green-700 font-bold text-sm mb-2">🎉 {t('bibelpose.code')}:</p>
                  <p className="text-4xl font-black text-green-700 tracking-widest">{submissionCode}</p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedScene(null);
                      setPhoto(null);
                      setSubmitted(false);
                      setUploadError(null);
                      setSubmissionId(null);
                      setSubmissionCode(null);
                      setSubmissionStatus('pending');
                      setRejectionMessage(null);
                    }}
                    className="flex-1 bg-green-700 hover:bg-green-800 text-white font-black px-6 py-3 rounded-2xl"
                  >
                    {t('bibelpose.submitAnother')}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedScene(null);
                      setPhoto(null);
                      setSubmitted(false);
                      setUploadError(null);
                      setSubmissionId(null);
                      setSubmissionCode(null);
                      setSubmissionStatus('pending');
                      setRejectionMessage(null);
                    }}
                    className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-black px-6 py-3 rounded-2xl"
                  >
                    ← {t('common.back')}
                  </button>
                </div>
              </>
            ) : submissionStatus === 'rejected' ? (
              <>
                <div className="text-6xl mb-4">❌</div>
                <h2 className="text-3xl font-black text-red-700 mb-2">{t('bibelpose.rejected')}</h2>
                <p className="text-red-700 text-lg mb-6">{rejectionMessage}</p>
                
                <button
                  onClick={() => {
                    setSelectedScene(null);
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
                  {t('bibelpose.tryAgain')}
                </button>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4 animate-spin">⏳</div>
                <h2 className="text-3xl font-black text-green-700 mb-2">{t('bibelpose.submitted')}</h2>
                <p className="text-green-700 text-lg mb-2">{t('bibelpose.waitingConfirmation')}</p>
                <p className="text-green-600 text-sm">{t('bibelpose.adminWillConfirm')}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BibelposePage() {
  const { t } = useI18n();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Prüfe ob Team bereits angemeldet ist
    const savedTeamId = localStorage.getItem('fyw_bibelpose_team_id');
    if (savedTeamId) {
      fetchTeam(savedTeamId)
        .then(t => setTeam(t))
        .catch(() => localStorage.removeItem('fyw_bibelpose_team_id'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  function handleLogin(teamData) {
    localStorage.setItem('fyw_bibelpose_team_id', teamData.id);
    setTeam(teamData);
  }

  function handleLogout() {
    localStorage.removeItem('fyw_bibelpose_team_id');
    setTeam(null);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
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
