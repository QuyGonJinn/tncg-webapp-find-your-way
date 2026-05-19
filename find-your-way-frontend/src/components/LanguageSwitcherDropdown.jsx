import { useState } from 'react';
import { useI18n } from '../hooks/useI18n';

export default function LanguageSwitcherDropdown() {
  const { language, switchLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'de', name: '🇩🇪 Deutsch', label: 'Deutsch' },
    { code: 'en', name: '🇬🇧 English', label: 'English' },
  ];

  const currentLang = languages.find(l => l.code === language);

  function handleLanguageChange(langCode) {
    switchLanguage(langCode);
    setIsOpen(false);
    // Refresh the page after a short delay to ensure language is saved
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-stone-800/50 hover:bg-stone-800/70 text-amber-200 font-bold text-sm px-3 py-2 rounded-xl transition-all flex items-center gap-2"
      >
        {currentLang?.name}
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-stone-900 border-2 border-amber-300 rounded-xl shadow-lg z-50 min-w-max">
          {languages.map((lang, index) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full text-left px-4 py-2 font-bold text-sm transition-all ${
                language === lang.code
                  ? 'bg-amber-600 text-white'
                  : 'text-amber-200 hover:bg-stone-800'
              } ${index === 0 ? 'rounded-t-lg' : ''} ${index === languages.length - 1 ? 'rounded-b-lg' : ''}`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
