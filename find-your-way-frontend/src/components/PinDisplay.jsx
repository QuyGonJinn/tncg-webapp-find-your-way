import { useI18n } from '../hooks/useI18n';
import LanguageSwitcherDropdown from './LanguageSwitcherDropdown';

export default function PinDisplay({ pin, onContinue }) {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-800 via-stone-800 to-stone-900 flex flex-col items-center justify-center p-6">
      {/* Language Switcher - Top Right */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcherDropdown />
      </div>

      <div className="bg-amber-50 rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center border-2 border-amber-300">
        <div className="text-5xl mb-4">🔑</div>
        <h2 className="text-2xl font-black text-amber-900 mb-2">{t('pinDisplay.title')}</h2>
        <p className="text-stone-500 text-sm mb-6">
          {t('pinDisplay.description')}
        </p>

        <div className="bg-amber-100 border-2 border-amber-400 rounded-2xl py-5 px-6 mb-6">
          <p className="text-5xl font-black tracking-widest text-amber-800 select-all">{pin}</p>
        </div>

        <p className="text-xs text-stone-400 mb-6">{t('pinDisplay.tip')}</p>

        <button
          onClick={onContinue}
          className="w-full bg-amber-700 text-white font-black text-xl py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
        >
          {t('pinDisplay.button')}
        </button>
      </div>
    </div>
  );
}
