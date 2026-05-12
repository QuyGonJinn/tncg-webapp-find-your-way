import { useState, useRef } from 'react';

const LETTERS = [
  'A','B','C','D','E','F','G','H','I','J','K','L',
  'M','N','O','P','Q','R','S','T','U','V','W','X'
];

// Fallback-Beschreibungen falls Medien fehlen
const FALLBACK = {
  A: { gebaerde: "Faust mit Daumen seitlich",         bild: "Apfel",     memo: "Langer A-Laut" },
  B: { gebaerde: "Vier Finger gestreckt",              bild: "Buch",      memo: "Lippenlaut B" },
  C: { gebaerde: "Hand zur C-Form gebogen",            bild: "Computer",  memo: "Zischlaut C" },
  D: { gebaerde: "Zeigefinger oben, Kreis unten",      bild: "Drachen",   memo: "Zungenlaut D" },
  E: { gebaerde: "Alle Finger gebogen",                bild: "Elefant",   memo: "Heller E-Laut" },
  F: { gebaerde: "Daumen + Zeigefinger = Kreis",       bild: "Fisch",     memo: "Reibelaut F" },
  G: { gebaerde: "Zeigefinger + Daumen seitlich",      bild: "Gitarre",   memo: "Gaumenlaut G" },
  H: { gebaerde: "Zwei Finger seitlich gestreckt",     bild: "Haus",      memo: "Hauch-Laut H" },
  I: { gebaerde: "Kleiner Finger gestreckt",           bild: "Igel",      memo: "Spitzer I-Laut" },
  J: { gebaerde: "Kleiner Finger, J-Bewegung",         bild: "Jäger",     memo: "Weicher J-Laut" },
  K: { gebaerde: "Zwei Finger oben, Daumen zwischen",  bild: "Krone",     memo: "Harter K-Laut" },
  L: { gebaerde: "Daumen + Zeigefinger = L",           bild: "Löwe",      memo: "Zungenlaut L" },
  M: { gebaerde: "Drei Finger über Daumen",            bild: "Mond",      memo: "Summton M" },
  N: { gebaerde: "Zwei Finger über Daumen",            bild: "Nuss",      memo: "Nasenlaut N" },
  O: { gebaerde: "Alle Finger = O-Form",               bild: "Orange",    memo: "Runder O-Laut" },
  P: { gebaerde: "Wie K, nach unten zeigend",          bild: "Pferd",     memo: "Lippenlaut P" },
  Q: { gebaerde: "Wie G, nach unten zeigend",          bild: "Quelle",    memo: "Kombilaut Q" },
  R: { gebaerde: "Zwei Finger gekreuzt",               bild: "Regenbogen",memo: "Gerolltes R" },
  S: { gebaerde: "Faust, Daumen über Fingern",         bild: "Sonne",     memo: "Zischlaut S" },
  T: { gebaerde: "Daumen zwischen Fingern",            bild: "Taube",     memo: "Harter T-Laut" },
  U: { gebaerde: "Zwei Finger zusammen gestreckt",     bild: "Uhr",       memo: "Tiefer U-Laut" },
  V: { gebaerde: "Zwei Finger gespreizt (Victory)",    bild: "Vogel",     memo: "Wie F gesprochen" },
  W: { gebaerde: "Drei Finger gespreizt",              bild: "Welle",     memo: "Weicher W-Laut" },
  X: { gebaerde: "Zeigefinger gebogen wie Haken",      bild: "Xylophon",  memo: "Kombilaut X" },
};

const TABS = [
  { id: 'gebaerden', label: '🤟 Gebärden',    hint: 'Video',  ext: ['mp4','webm','mov'], folder: 'gebaerden' },
  { id: 'bilder',    label: '�️ Bilder',      hint: 'Bild',   ext: ['jpg','jpeg','png','webp'], folder: 'bilder' },
  { id: 'memos',     label: '🔊 Sprachmemos', hint: 'Audio',  ext: ['mp3','ogg','wav'], folder: 'memos' },
];

const COLORS = {
  gebaerden: { header: 'from-stone-900 to-amber-900',   active: 'bg-amber-600',   badge: 'bg-amber-700',   card: 'bg-amber-50 border-amber-200',   text: 'text-amber-800',   ring: 'ring-amber-400' },
  bilder:    { header: 'from-stone-900 to-amber-900',   active: 'bg-amber-600',   badge: 'bg-stone-700',   card: 'bg-stone-50 border-stone-200',   text: 'text-stone-800',   ring: 'ring-stone-400' },
  memos:     { header: 'from-stone-900 to-amber-900',   active: 'bg-amber-600',   badge: 'bg-amber-800',   card: 'bg-amber-50 border-amber-300',   text: 'text-amber-900',   ring: 'ring-amber-500' },
};

function VideoCard({ letter, colors }) {
  const [error, setError] = useState(false);
  const videoRef = useRef(null);
  const src = `/spelling-bee-media/gebaerden/${letter}.mp4`;

  if (error) {
    return (
      <div className="w-full aspect-video bg-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300">
        <span className="text-4xl">🎬</span>
        <p className="text-gray-500 text-sm font-semibold">Video noch nicht hochgeladen</p>
        <p className="text-gray-400 text-xs">Datei: gebaerden/{letter}.mp4</p>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      src={src}
      controls
      playsInline
      className="w-full rounded-2xl shadow-md bg-black"
      onError={() => setError(true)}
    />
  );
}

function ImageCard({ letter, colors }) {
  const [error, setError] = useState(false);
  const [tried, setTried] = useState(0);
  const exts = ['jpg', 'jpeg', 'png', 'webp'];

  if (error) {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300">
        <span className="text-4xl">�️</span>
        <p className="text-gray-500 text-sm font-semibold">Bild noch nicht hochgeladen</p>
        <p className="text-gray-400 text-xs">Datei: bilder/{letter}.jpg</p>
      </div>
    );
  }

  return (
    <img
      src={`/spelling-bee-media/bilder/${letter}.${exts[tried]}`}
      alt={`Bild für ${letter}`}
      className="w-full rounded-2xl shadow-md object-contain max-h-64"
      onError={() => {
        if (tried < exts.length - 1) setTried(tried + 1);
        else setError(true);
      }}
    />
  );
}

function AudioCard({ letter, colors }) {
  const [error, setError] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const src = `/spelling-bee-media/memos/${letter}.mp3`;

  function togglePlay() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  }

  if (error) {
    return (
      <div className="w-full py-8 bg-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300">
        <span className="text-4xl">🔊</span>
        <p className="text-gray-500 text-sm font-semibold">Sprachmemo noch nicht hochgeladen</p>
        <p className="text-gray-400 text-xs">Datei: memos/{letter}.mp3</p>
      </div>
    );
  }

  return (
    <div className={`w-full py-6 ${colors.card} border-2 rounded-2xl flex flex-col items-center gap-4`}>
      <audio
        ref={audioRef}
        src={src}
        onEnded={() => setPlaying(false)}
        onError={() => setError(true)}
      />
      <button
        onClick={togglePlay}
        className={`w-20 h-20 rounded-full ${colors.badge} text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform text-3xl`}
      >
        {playing ? '⏹' : '▶️'}
      </button>
      <p className={`text-sm font-bold ${colors.text}`}>
        {playing ? 'Spielt ab...' : 'Tippen zum Abspielen'}
      </p>
    </div>
  );
}

export default function SpellingBeePage() {
  const [tab, setTab] = useState('gebaerden');
  const [selectedLetter, setSelectedLetter] = useState(null);
  const colors = COLORS[tab];

  function handleLetterClick(letter) {
    setSelectedLetter(selectedLetter === letter ? null : letter);
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${colors.header} text-amber-100 px-4 pt-6 pb-4 shadow-lg sticky top-0 z-10`}>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-4xl">🐝</span>
          <div>
            <h1 className="text-2xl font-black leading-tight text-amber-50">Spelling Bee</h1>
            <p className="text-amber-300 text-sm">Buchstaben-Alphabet · 24 Zeichen</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setSelectedLetter(null); }}
              className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all ${
                tab === t.id ? 'bg-amber-500 text-white ring-2 ring-amber-300' : 'bg-white/10 text-amber-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 max-w-lg mx-auto">

        {/* Letter Grid */}
        <div className="grid grid-cols-6 gap-2 mb-4">
          {LETTERS.map(letter => (
            <button
              key={letter}
              onClick={() => handleLetterClick(letter)}
              className={`aspect-square rounded-2xl font-black text-xl flex items-center justify-center transition-all shadow-sm ${
                selectedLetter === letter
                  ? `${colors.badge} text-white scale-110 shadow-md`
                  : 'bg-white border-2 border-amber-200 text-stone-700 active:scale-95'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Detail Panel */}
        {selectedLetter && (
          <div className={`${colors.card} border-2 rounded-3xl p-5 mb-4 shadow-md`}>
            {/* Title */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-14 h-14 rounded-2xl ${colors.badge} flex items-center justify-center text-white font-black text-3xl shadow`}>
                {selectedLetter}
              </div>
              <div>
                <p className="text-xs text-stone-500 font-bold uppercase tracking-wide">
                  {tab === 'gebaerden' ? 'Gebärde' : tab === 'bilder' ? 'Bild' : 'Sprachmemo'}
                </p>
                <p className={`font-black text-lg ${colors.text}`}>
                  {tab === 'gebaerden' && FALLBACK[selectedLetter].gebaerde}
                  {tab === 'bilder'    && FALLBACK[selectedLetter].bild}
                  {tab === 'memos'     && FALLBACK[selectedLetter].memo}
                </p>
              </div>
            </div>

            {/* Media */}
            {tab === 'gebaerden' && <VideoCard letter={selectedLetter} colors={colors} />}
            {tab === 'bilder'    && <ImageCard letter={selectedLetter} colors={colors} />}
            {tab === 'memos'     && <AudioCard letter={selectedLetter} colors={colors} />}

            {/* Close */}
            <button
              onClick={() => setSelectedLetter(null)}
              className="w-full mt-4 py-2 rounded-xl border-2 border-amber-200 text-stone-500 font-bold text-sm"
            >
              Schließen ✕
            </button>
          </div>
        )}

        {/* All Letters List */}
        <div className="space-y-2">
          <p className="text-stone-500 font-bold text-xs uppercase tracking-wide mb-2">Alle 24 Buchstaben</p>
          {LETTERS.map(letter => (
            <button
              key={letter}
              onClick={() => handleLetterClick(letter)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-left ${
                selectedLetter === letter
                  ? `${colors.card} shadow-md`
                  : 'bg-white border-amber-100 active:scale-[0.98]'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl ${colors.badge} flex items-center justify-center text-white font-black text-lg shrink-0`}>
                {letter}
              </div>
              <p className="text-sm text-stone-700 font-medium flex-1 truncate">
                {tab === 'gebaerden' && FALLBACK[letter].gebaerde}
                {tab === 'bilder'    && FALLBACK[letter].bild}
                {tab === 'memos'     && FALLBACK[letter].memo}
              </p>
              <span className="text-stone-400 text-xs shrink-0">
                {selectedLetter === letter ? '▲' : '▼'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
