import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import myTranslations from './locales/my.json';
import chTranslations from './locales/ch.json';

const resources = {
  en: {
    translation: enTranslations,
  },
  my: {
    translation: myTranslations,
  },
  zh: {
    translation: chTranslations,
  },
};

const getSavedLanguage = () => {
  try {
    const saved = localStorage.getItem("clover-app-store");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed?.state?.language) {
        return parsed.state.language;
      }
    }
  } catch (e) {
    console.error(e);
  }
  return "en";
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getSavedLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values to prevent XSS
    },
  });

// Sync the <html lang="..."> attribute with the active language
// so CSS selectors like html[lang="my"] work automatically
const syncHtmlLang = (lang: string) => {
  document.documentElement.lang = lang;
};

// Set on init
syncHtmlLang(i18n.language);

// Update whenever language changes
i18n.on('languageChanged', syncHtmlLang);

export default i18n;
