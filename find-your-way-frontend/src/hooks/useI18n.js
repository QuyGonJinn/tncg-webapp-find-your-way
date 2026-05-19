import { useState, useEffect } from 'react';
import de from '../i18n/de.json';
import en from '../i18n/en.json';

const TRANSLATIONS = { de, en };
const STORAGE_KEY = 'fyw_language';
const DEFAULT_LANGUAGE = 'de';

export function useI18n() {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  function t(key, defaultValue = '') {
    const keys = key.split('.');
    let value = TRANSLATIONS[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return defaultValue || key;
      }
    }
    
    return value || defaultValue || key;
  }

  function switchLanguage(lang) {
    if (TRANSLATIONS[lang]) {
      setLanguage(lang);
    }
  }

  return { t, language, switchLanguage };
}
