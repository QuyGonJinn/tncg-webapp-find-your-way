import { useI18n } from '../hooks/useI18n';

export default function LanguageSwitcher() {
  const { language, switchLanguage } = useI18n();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => switchLanguage('de')}
        className={`px-3 py-1 rounded-lg font-bold text-sm transition-all ${
          language === 'de'
            ? 'bg-white text-blue-700'
            : 'bg-blue-700/50 text-blue-200 hover:bg-blue-700/70'
        }`}
      >
        🇩🇪 Deutsch
      </button>
      <button
        onClick={() => switchLanguage('en')}
        className={`px-3 py-1 rounded-lg font-bold text-sm transition-all ${
          language === 'en'
            ? 'bg-white text-blue-700'
            : 'bg-blue-700/50 text-blue-200 hover:bg-blue-700/70'
        }`}
      >
        🇬🇧 English
      </button>
      <button
        onClick={() => switchLanguage('vi')}
        className={`px-3 py-1 rounded-lg font-bold text-sm transition-all ${
          language === 'vi'
            ? 'bg-white text-blue-700'
            : 'bg-blue-700/50 text-blue-200 hover:bg-blue-700/70'
        }`}
      >
        🇻🇳 Tiếng Việt
      </button>
    </div>
  );
}
