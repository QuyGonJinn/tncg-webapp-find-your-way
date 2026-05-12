import { useState, useRef } from 'react';

const LETTERS = [
  'A','B','C','D','E','F','G','H','I','J','K','L',
  'M','N','O','P','Q','R','S','T','U','V','W','X'
];

const FALLBACK = {
  A: { gebaerde: "Faust mit Daumen seitlich",         bild: "Apfel",      memo: "Langer A-Laut" },
  B: { gebaerde: "Vier Finger gestreckt",              bild: "Buch",       memo: "Lippenlaut B" },
  C: { gebaerde: "Hand zur C-Form gebogen",            bild: "Computer",   memo: "Zischlaut C" },
  D: { gebaerde: "Zeigefinger oben, Kreis unten",      bild: "Drachen",    memo: "Zungenlaut D" },
  E: { gebaerde: "Alle Finger gebogen",                bild: "Elefant",    memo: "Heller E-Laut" },
  F: { gebaerde: "Daumen + Zeigefinger = Kreis",       bild: "Fisch",      memo: "Reibelaut F" },
  G: { gebaerde: "Zeigefinger + Daumen seitlich",      bild: "Gitarre",    memo: "Gaumenlaut G" },
  H: { gebaerde: "Zwei Finger seitlich gestreckt",     bild: "Haus",       memo: "Hauch-Laut H" },
  I: { gebaerde: "Kleiner Finger gestreckt",           bild: "Igel",       memo: "Spitzer I-Laut" },
  J: { gebaerde: "Kleiner Finger, J-Bewegung",         bild: "Jaeger",     memo: "Weicher J-Laut" },
  K: { gebaerde: "Zwei Finger oben, Daumen zwischen",  bild: "Krone",      memo: "Harter K-Laut" },
  L: { gebaerde: "Daumen + Zeigefinger = L",           bild: "Loewe",      memo: "Zungenlaut L" },
  M: { gebaerde: "Drei Finger ueber Daumen",           bild: "Mond",       memo: "Summton M" },
  N: { gebaerde: "Zwei Finger ueber Daumen",           bild: "Nuss",       memo: "Nasenlaut N" },
  O: { gebaerde: "Alle Finger = O-Form",               bild: "Orange",     memo: "Runder O-Laut" },
  P: { gebaerde: "Wie K, nach unten zeigend",          bild: "Pferd",      memo: "Lippenlaut P" },
  Q: { gebaerde: "Wie G, nach unten zeigend",          bild: "Quelle",     memo: "Kombilaut Q" },
  R: { gebaerde: "Zwei Finger gekreuzt",               bild: "Regenbogen", memo: "Gerolltes R" },
  S: { gebaerde: "Faust, Daumen ueber Fingern",        bild: "Sonne",      memo: "Zischlaut S" },
  T: { gebaerde: "Daumen zwischen Fingern",            bild: "Taube",      memo: "Harter T-Laut" },
  U: { gebaerde: "Zwei Finger zusammen gestreckt",     bild: "Uhr",        memo: "Tiefer U-Laut" },
  V: { gebaerde: "Zwei Finger gespreizt (Victory)",    bild: "Vogel",      memo: "Wie F gesprochen" },
  W: { gebaerde: "Drei Finger gespreizt",              bild: "Welle",      memo: "Weicher W-Laut" },
  X: { gebaerde: "Zeigefinger gebogen wie Haken",      bild: "Xylophon",   memo: "Kombilaut X" },
};

const TABS = [
  { id: 'gebaerden', label: 'Gebaerden' },
  { id: 'bilder',    label: 'Bilder'    },
  { id: 'memos',     label: 'Sprachmemos' },
];

function VideoCard({ letter }) {
  const [error, setError] = useState(false);
  const videoRef = useRef(null);

  if (error) {
    return (
      <div className="w-full aspect-video bg-amber-50 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 border-dashed border-amber-300">
        <span className="text-4xl">🎬</span>
        <p className="text-stone-500 text-sm font-semibold">Video noch nicht hochgeladen</p>
        <p className="text-stone-400 text-xs">Datei: gebaerden/{letter}.mp4</p>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      src={`/spelling-bee-media/gebaerden/${letter}.mp4`}
      controls
      playsInline
      className="w-full rounded-2xl shadow-md bg-black"
      onError={() => setError(true)}
    />
  );
}

function ImageCard({ letter }) {
  const [error, setError] = useState(false);
  const [tried, setTried] = useState(0);
  const exts = ['jpg', 'jpeg', 'png', 'webp'];

  if (error) {
    return (
      <div className="w-full aspect-square bg-amber-50 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 border-dashed border-amber-300">
        <span className="text-4xl">🖼</span>
        <p className="text-stone-500 text-sm font-semibold">Bild noch nicht hochgeladen</p>
        <p className="text-stone-400 text-xs">Datei: bilder/{letter}.jpg</p>
      </div>
    );
  }

  return (
    <img
      src={`/spelling-bee-media/bilder/${letter}.${exts[tried]}`}
      alt={`Bild fuer ${letter}`}
      className="w-full rounded-2xl shadow-md object-contain max-h-64"
      onError={() => {
        if (tried < exts.length - 1) setTried(tried + 1);
        else setError(true);
      }}
    />
  );
}

function AudioCard({ letter }) {
  const [error, setError] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

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
      <div className="w-full py-8 bg-amber-50 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 border-dashed border-amber-300">
        <span className="text-4xl">🔊</span>
        <p className="text-stone-500 text-sm font-semibold">Sprachmemo noch nicht hochgeladen</p>
        <p className="text-stone-400 text-xs">Datei: memos/{letter}.mp3</p>
      </div>
    );
  }

  return (
    <div className="w-full py-6 bg-amber-50 border-2 border-amber-200 rounded-2xl flex flex-col items-center gap-4">
      <audio
        ref={audioRef}
        src={`/spelling-bee-media/memos/${letter}.mp3`}
        onEnded={() => setPlaying(false)}
        onError={() => setError(true)}
      />
      <button
        onClick={togglePlay}
        className="w-20 h-20 rounded-full bg-amber-700 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform text-3xl"
      >
        {playing ? '⏹' : '▶️'}
      </button>
      <p className="text-sm font-bold text-amber-900">
        {playing ? 'Spielt ab...' : 'Tippen zum Abspielen'}
      </p>
    </div>
  );
}

export default function SpellingBeePage() {
  const [tab, setTab] = useState('gebaerden');
  const [selectedLetter, setSelectedLetter] = useState(null);

  const tabLabels = {
    gebaerden: '🤟 Gebaerden',
    bilder:    '🖼 Bilder',
    memos:     '🔊 Sprachmemos',
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header – gleicher Stil wie GameScreen */}
      <div className="bg-gradient-to-r from-stone-900 to-amber-900 text-amber-100 px-4 pt-6 pb-4 shadow-lg sticky top-0 z-10">
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
                tab === t.id
                  ? 'bg-amber-500 text-white'
                  : 'bg-white/10 text-amber-200'
              }`}
            >
              {tabLabels[t.id]}
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
              onClick={() => setSelectedLetter(selectedLetter === letter ? null : letter)}
              className={`aspect-square rounded-2xl font-black text-xl flex items-center justify-center transition-all shadow-sm ${
                selectedLetter === letter
                  ? 'bg-amber-700 text-white scale-110 shadow-md'
                  : 'bg-white border-2 border-amber-200 text-stone-700 active:scale-95'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Detail Panel */}
        {selectedLetter && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-5 mb-4 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-700 flex items-center justify-center text-white font-black text-3xl shadow">
                {selectedLetter}
              </div>
              <div>
                <p className="text-xs text-stone-500 font-bold uppercase tracking-wide">
                  {tab === 'gebaerden' ? 'Gebaerde' : tab === 'bilder' ? 'Bild' : 'Sprachmemo'}
                </p>
                <p className="font-black text-lg text-amber-900">
                  {tab === 'gebaerden' && FALLBACK[selectedLetter].gebaerde}
                  {tab === 'bilder'    && FALLBACK[selectedLetter].bild}
                  {tab === 'memos'     && FALLBACK[selectedLetter].memo}
                </p>
              </div>
            </div>

            {tab === 'gebaerden' && <VideoCard letter={selectedLetter} />}
            {tab === 'bilder'    && <ImageCard letter={selectedLetter} />}
            {tab === 'memos'     && <AudioCard letter={selectedLetter} />}

            <button
              onClick={() => setSelectedLetter(null)}
              className="w-full mt-4 py-2 rounded-xl border-2 border-amber-200 text-stone-500 font-bold text-sm"
            >
              Schliessen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
