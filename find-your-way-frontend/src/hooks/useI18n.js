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

  function t(key, params = {}) {
    const keys = key.split('.');
    let value = TRANSLATIONS[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }
    
    if (!value) return key;
    
    // Replace placeholders like {minutes}, {correct}, etc.
    let result = value;
    for (const [paramKey, paramValue] of Object.entries(params)) {
      result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), paramValue);
    }
    
    return result;
  }

  function switchLanguage(lang) {
    if (TRANSLATIONS[lang]) {
      setLanguage(lang);
    }
  }

  return { t, language, switchLanguage };
}
