import { HINTS_DATA } from '../data/hints';
import { useI18n } from '../hooks/useI18n';

export default function HintBox({ completedCount }) {
  const { t } = useI18n();
  const hint = [...HINTS_DATA].reverse().find(h => completedCount >= h.threshold);
  if (!hint) return null;

  return (
    <div className="bg-amber-100 border-2 border-amber-300 rounded-2xl p-4 mx-4 mb-4 mt-4">
      <p className="text-amber-900 font-semibold text-sm">
        🗺️ <span className="font-bold">{t('game.hint')}:</span> {t(hint.textKey)}
      </p>
    </div>
  );
}
