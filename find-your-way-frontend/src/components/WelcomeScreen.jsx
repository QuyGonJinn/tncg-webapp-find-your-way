import { useI18n } from '../hooks/useI18n';
import LanguageSwitcherDropdown from './LanguageSwitcherDropdown';

export default function WelcomeScreen({ onContinue }) {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-800 via-stone-800 to-stone-900 flex flex-col items-center justify-center p-6">
      {/* Language Switcher - Top Right */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcherDropdown />
      </div>

      {/* Logo & Title */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-3 animate-bounce">🗺️</div>
        <h1 className="text-4xl font-black text-amber-100 tracking-tight">{t('welcome.title')}</h1>
        <p className="text-amber-300 mt-2 text-lg">{t('welcome.subtitle')}</p>
      </div>

      {/* Welcome Card */}
      <div className="bg-amber-50 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border-2 border-amber-300 p-8">
        {/* Welcome Text */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🌊</div>
          <h2 className="text-2xl font-black text-stone-900 mb-3">Willkommen!</h2>
          <p className="text-stone-700 text-sm leading-relaxed">
            {t('welcome.description')}
          </p>
        </div>

        {/* How it works */}
        <div className="bg-amber-100 border-2 border-amber-300 rounded-2xl p-5 mb-8">
          <p className="text-amber-900 font-black text-sm mb-4">{t('welcome.howItWorks')}</p>
          <ul className="space-y-3 text-sm text-amber-900">
            <li className="flex gap-2">
              <span className="font-black">1️⃣</span>
              <span>{t('welcome.step1')}</span>
            </li>
            <li className="flex gap-2">
              <span className="font-black">2️⃣</span>
              <span>{t('welcome.step2')}</span>
            </li>
            <li className="flex gap-2">
              <span className="font-black">3️⃣</span>
              <span>{t('welcome.step3')}</span>
            </li>
            <li className="flex gap-2">
              <span className="font-black">4️⃣</span>
              <span>{t('welcome.step4')}</span>
            </li>
          </ul>
        </div>

        {/* Key Info */}
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-5 mb-8">
          <p className="text-yellow-900 font-bold text-sm mb-2">{t('welcome.important')}</p>
          <ul className="space-y-2 text-xs text-yellow-900">
            <li>✓ {t('welcome.passiveStations')}</li>
            <li>✓ {t('welcome.activeStations')}</li>
            <li>✓ {t('welcome.rememberCode')}</li>
            <li>✓ {t('welcome.useChat')}</li>
          </ul>
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="w-full bg-amber-700 hover:bg-amber-800 text-white font-black text-lg py-4 rounded-2xl shadow-lg active:scale-95 transition-all"
        >
          {t('welcome.button')}
        </button>
      </div>

      {/* Footer */}
      <p className="text-amber-300 text-xs mt-8 text-center max-w-md">
        {t('welcome.footer')}
      </p>
    </div>
  );
}
