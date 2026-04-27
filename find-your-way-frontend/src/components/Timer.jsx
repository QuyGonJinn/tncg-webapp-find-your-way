export default function Timer({ timeLeft }) {
  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;
  const pad = n => String(n).padStart(2, '0');
  const urgent = timeLeft < 600; // last 10 min

  return (
    <div className={`flex items-center gap-1 font-mono font-black text-2xl ${urgent ? 'text-red-500 animate-pulse' : 'text-white'}`}>
      ⏱ {pad(h)}:{pad(m)}:{pad(s)}
    </div>
  );
}
