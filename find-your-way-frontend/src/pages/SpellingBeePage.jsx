import { useState, useRef } from 'react';

// 5 Gebärden-Videos mit den korrekten Wörtern
const SPELLING_BEE_WORDS = [
  { id: 1, word: 'GLAUBE', hint: 'Video 1' },
  { id: 2, word: 'HOFFNUNG', hint: 'Video 2' },
  { id: 3, word: 'LIEBE', hint: 'Video 3' },
  { id: 4, word: 'FREUDE', hint: 'Video 4' },
  { id: 5, word: 'FRIEDE', hint: 'Video 5' },
];

const CORRECT_CODE = '12345'; // Code der angezeigt wird wenn alle 5 Wörter richtig sind

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

export default function SpellingBeePage() {
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
  const [showCode, setShowCode] = useState(false);

  function handleAnswerChange(id, value) {
    setAnswers(prev => ({ ...prev, [id]: value }));
    
    // Prüfe ob das Wort richtig ist
    const wordData = SPELLING_BEE_WORDS.find(w => w.id === id);
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
  const allCorrect = SPELLING_BEE_WORDS.every(w => answers[w.id] === w.word);

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-900 to-amber-900 text-amber-100 px-4 pt-6 pb-4 shadow-lg sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-4xl">🐝</span>
          <div>
            <h1 className="text-2xl font-black leading-tight text-amber-50">Spelling Bee</h1>
            <p className="text-amber-300 text-sm">Gebärden-Rätsel · 5 Videos</p>
          </div>
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
          {SPELLING_BEE_WORDS.map(wordData => (
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
            {SPELLING_BEE_WORDS.map(wordData => (
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
                <p className="text-4xl font-black text-green-700 tracking-widest">{CORRECT_CODE}</p>
              </div>
              <p className="text-green-700 text-xs font-bold">Trage diesen Code in die App ein!</p>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        {!allCorrect && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 text-center">
            <p className="text-amber-900 font-bold text-sm">
              ✓ {Object.values(feedback).filter(f => f === 'correct').length} / 5 Wörter richtig
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
