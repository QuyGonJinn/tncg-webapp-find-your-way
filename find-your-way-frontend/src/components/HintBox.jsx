import { HINTS } from '../data/hints';

export default function HintBox({ completedCount }) {
  const hint = [...HINTS].reverse().find(h => completedCount >= h.threshold);
  if (!hint) return null;

  return (
    <div className="bg-amber-100 border-2 border-amber-300 rounded-2xl p-4 mx-4 mb-4 mt-4">
      <p className="text-amber-900 font-semibold text-sm">
        🗺️ <span className="font-bold">Hinweis:</span> {hint.text}
      </p>
    </div>
  );
}
