const HINTS = [
  { threshold: 0,  text: "Ihr seid am Start – los geht's! Sucht zuerst die einfachsten Stationen." },
  { threshold: 3,  text: "Gut gemacht! Tipp: Aktive Stationen bringen mehr Punkte – traut euch!" },
  { threshold: 6,  text: "Halbzeit! Schaut, welche Stationen noch offen sind und plant eure Route." },
  { threshold: 9,  text: "Fast geschafft! Nur noch wenige Stationen – gebt alles!" },
  { threshold: 11, text: "Unglaublich! Noch eine Station – ihr seid echte Champions!" },
];

export default function HintBox({ completedCount }) {
  const hint = [...HINTS].reverse().find(h => completedCount >= h.threshold);
  if (!hint) return null;

  return (
    <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-4 mx-4 mb-4 mt-4">
      <p className="text-blue-900 font-semibold text-sm">
        ⚓ <span className="font-bold">Hinweis:</span> {hint.text}
      </p>
    </div>
  );
}
