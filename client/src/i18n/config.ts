import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';

const resources = {
  en: {
    translation: enTranslations,
  },
  ar: {
    translation: arTranslations,
  },
};

const savedLanguage = localStorage.getItem('language') || 'en';

function applyDocumentLanguage(lang: string) {
  if (typeof document === 'undefined') return;
  if (lang === 'ar') {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  } else {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
  }
}

// Apply immediately on boot (important on refresh)
applyDocumentLanguage(savedLanguage);

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Keep html dir/lang and saved preference in sync
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
  applyDocumentLanguage(lng);
});

export default i18n;
