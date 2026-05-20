import { useState, useRef, useEffect } from 'react';
import { loginWithPin, fetchTeam } from '../api';

// 5 Gebärden-Videos mit den korrekten Wörtern
const WORT_DES_GLAUBENS_WORDS = [
  { id: 1, word: 'GLAUBE', hint: 'Video 1' },
  { id: 2, word: 'HOFFNUNG', hint: 'Video 2' },
  { id: 3, word: 'LIEBE', hint: 'Video 3' },
  { id: 4, word: 'FREUDE', hint: 'Video 4' },
  { id: 5, word: 'FRIEDE', hint: 'Video 5' },
];

// Code wird aus der Datenbank geladen (siehe GameScreen)

function VideoCard({ videoId, onVideoLoad }) {
  const [error, setError] = useState(false);
  const videoRef = useRef(null);

  if (error) {
    return (
      <div className="w-full aspect-video bg-amber-50 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 border-dashed border-amber-300">
        <span className="text-4xl">🎬</span>
        <p className="text-stone-500 text-sm font-semibold">Video noch nicht hochgeladen</p>
        <p className="text-stone-400 text-xs">Datei: gebaerden/{videoId}.mp4</p>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      src={`/spelling-bee-media/gebaerden/${videoId}.mp4`}
      controls
      playsInline
      className="w-full rounded-2xl shadow-md bg-black"
      onError={() => setError(true)}
      onLoadedMetadata={() => onVideoLoad?.(videoId)}
    />
  );
}

function WordInput({ wordData, value, onChange, feedback }) {
  const isCorrect = feedback === 'correct';
  const isWrong = feedback === 'wrong';

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-stone-700">
        {wordData.hint}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          placeholder="Wort eingeben..."
          className={`flex-1 border-2 rounded-xl px-4 py-2 font-bold text-lg focus:outline-none transition-all ${
            isCorrect
              ? 'border-green-500 bg-green-50 text-green-900'
              : isWrong
              ? 'border-red-500 bg-red-50 text-red-900'
              : 'border-amber-200 focus:border-amber-500'
          }`}
        />
        {feedback && (
          <div className={`flex items-center justify-center px-4 rounded-xl font-bold text-lg ${
            isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {isCorrect ? '✅' : '❌'}
          </div>
        )}
      </div>
    </div>
  );
}

function LoginScreen({ onLogin, error }) {
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
      setLoginError(e.message || 'Login fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-800 via-stone-800 to-stone-900 flex flex-col items-center justify-center p-6">
      {/* Logo & Title */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-3 animate-bounce">🐝</div>
        <h1 className="text-4xl font-black text-amber-100 tracking-tight">Wort des Glaubens</h1>
        <p className="text-amber-300 mt-2 text-lg">Gebärden-Rätsel</p>
      </div>

      {/* Login Card */}
      <div className="bg-amber-50 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border-2 border-amber-300 p-8">
        <div className="text-center mb-6">
          <p className="text-stone-700 text-sm leading-relaxed">
            Melde dich mit deinem Team-PIN an um das Wort des Glaubens zu spielen.
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
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Team-PIN eingeben"
            className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:border-amber-500"
            disabled={loading}
          />

          <button
            onClick={handleLogin}
            disabled={loading || !pin}
            className="w-full bg-amber-700 hover:bg-amber-800 disabled:bg-gray-400 text-white font-black text-lg py-4 rounded-2xl shadow-lg active:scale-95 transition-all"
          >
            {loading ? '⏳ Wird angemeldet...' : '🚀 Anmelden'}
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Dein Team-PIN wurde dir bei der Anmeldung gegeben.
        </p>
      </div>
    </div>
  );
}

function GameScreen({ team, onLogout }) {
  const [answers, setAnswers] = useState({
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
  });
  const [feedback, setFeedback] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
  });
  const [correctCode, setCorrectCode] = useState('SB95'); // Fallback

  // Lade den Code aus der Datenbank
  useEffect(() => {
    const loadCode = async () => {
      try {
        const apiBase = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3001'}/api`;
        const response = await fetch(`${apiBase}/stations/codes`);
        const codes = await response.json();
      // Station 12 ist Wort des Glaubens
        if (codes[12]) {
          setCorrectCode(codes[12]);
        }
      } catch (error) {
        console.error('Error loading code:', error);
        // Fallback zu default code
      }
    };
    loadCode();
  }, []);

  function handleAnswerChange(id, value) {
    setAnswers(prev => ({ ...prev, [id]: value }));
    
    // Prüfe ob das Wort richtig ist
    const wordData = WORT_DES_GLAUBENS_WORDS.find(w => w.id === id);
    if (value.length > 0) {
      if (value === wordData.word) {
        setFeedback(prev => ({ ...prev, [id]: 'correct' }));
      } else {
        setFeedback(prev => ({ ...prev, [id]: 'wrong' }));
      }
    } else {
      setFeedback(prev => ({ ...prev, [id]: null }));
    }
  }

  // Prüfe ob alle 5 Wörter richtig sind
  const allCorrect = WORT_DES_GLAUBENS_WORDS.every(w => answers[w.id] === w.word);
  const correctCount = Object.values(feedback).filter(f => f === 'correct').length;

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-900 to-amber-900 text-amber-100 px-4 pt-6 pb-4 shadow-lg sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🐝</span>
            <div>
              <h1 className="text-2xl font-black leading-tight text-amber-50">Wort des Glaubens</h1>
              <p className="text-amber-300 text-sm">Gebärden-Rätsel · 5 Videos</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>

        {/* Team Info */}
        <div className="bg-stone-800/50 rounded-xl px-3 py-2">
          <p className="text-amber-300 text-sm font-bold">
            {team.icon} {team.name}
          </p>
        </div>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Instructions */}
        <div className="bg-amber-100 border-2 border-amber-300 rounded-2xl p-4 mb-6">
          <p className="text-amber-900 font-bold text-sm mb-2">📋 Anleitung:</p>
          <ol className="text-amber-900 text-sm space-y-1 list-decimal list-inside">
            <li>Schau dir die 5 Videos an</li>
            <li>Erkenne die Gebärden mit Hilfe des ausgedruckten Alphabets</li>
            <li>Trage die 5 Wörter ein</li>
            <li>Wenn alle richtig sind, erscheint der Code</li>
          </ol>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {WORT_DES_GLAUBENS_WORDS.map(wordData => (
            <div key={wordData.id} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-amber-700">{wordData.id}</span>
                <p className="text-sm font-bold text-stone-600">{wordData.hint}</p>
              </div>
              <VideoCard videoId={wordData.id} />
            </div>
          ))}
        </div>

        {/* Word Input Section */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-amber-900 font-black text-lg mb-4">🎯 Wörter eingeben</h2>
          <div className="space-y-4">
            {WORT_DES_GLAUBENS_WORDS.map(wordData => (
              <WordInput
                key={wordData.id}
                wordData={wordData}
                value={answers[wordData.id]}
                onChange={(value) => handleAnswerChange(wordData.id, value)}
                feedback={feedback[wordData.id]}
              />
            ))}
          </div>
        </div>

        {/* Code Display */}
        {allCorrect && (
          <div className="bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-400 rounded-2xl p-6 shadow-lg animate-pulse">
            <div className="text-center">
              <p className="text-green-700 font-bold text-sm mb-2">🎉 Alle Wörter richtig!</p>
              <p className="text-stone-600 text-xs mb-3">Hier ist dein Code:</p>
              <div className="bg-white rounded-xl p-4 border-2 border-green-400 mb-3">
                <p className="text-4xl font-black text-green-700 tracking-widest">{correctCode}</p>
              </div>
              <p className="text-green-700 text-xs font-bold">Trage diesen Code in die App ein!</p>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        {!allCorrect && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 text-center">
            <p className="text-amber-900 font-bold text-sm">
              ✓ {correctCount} / 5 Wörter richtig
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WortDesGlaubensPage() {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Prüfe ob Team bereits angemeldet ist
    const savedTeamId = localStorage.getItem('fyw_wort_des_glaubens_team_id');
    if (savedTeamId) {
      fetchTeam(savedTeamId)
        .then(t => setTeam(t))
        .catch(() => localStorage.removeItem('fyw_wort_des_glaubens_team_id'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  function handleLogin(teamData) {
    localStorage.setItem('fyw_wort_des_glaubens_team_id', teamData.id);
    setTeam(teamData);
  }

  function handleLogout() {
    localStorage.removeItem('fyw_wort_des_glaubens_team_id');
    setTeam(null);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <p className="text-gray-500">Wird geladen...</p>
      </div>
    );
  }

  return team ? (
    <GameScreen team={team} onLogout={handleLogout} />
  ) : (
    <LoginScreen onLogin={handleLogin} />
  );
}
