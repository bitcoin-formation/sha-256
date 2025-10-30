import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import frCA from './locales/fr-CA.json';
import en from './locales/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'fr-CA': {
        translation: frCA,
      },
      en: {
        translation: en,
      },
    },
    lng: 'fr-CA', // Langue par défaut
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

