import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ];

  return (
    <div className="flex gap-2">
      {languages.map(lang => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`px-3 py-1.5 rounded-lg font-bold text-sm transition-all ${
            i18n.language === lang.code
              ? 'bg-white text-blue-700 shadow-md'
              : 'bg-blue-700/50 text-white hover:bg-blue-700/70'
          }`}
          title={lang.name}
        >
          {lang.flag} {lang.code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
