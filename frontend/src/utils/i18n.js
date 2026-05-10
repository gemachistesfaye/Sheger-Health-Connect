import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../translations/en.json';
import am from '../translations/am.json';
import om from '../translations/om.json';

i18n
  .use(LanguageDetector) // Auto-detect browser language
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      am: { translation: am },
      om: { translation: om }
    },
    fallbackLng: 'en', // Default to English if translation missing
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'], // Persist user choice across sessions
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    }
  });

export default i18n;
