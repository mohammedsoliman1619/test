import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from '../locales/en.json';
import es from '../locales/es.json';
import zh from '../locales/zh.json';
import ar from '../locales/ar.json';
import fr from '../locales/fr.json';
import hi from '../locales/hi.json';
import ru from '../locales/ru.json';
import pt from '../locales/pt.json';
import de from '../locales/de.json';
import ja from '../locales/ja.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
  zh: { translation: zh },
  ar: { translation: ar },
  fr: { translation: fr },
  hi: { translation: hi },
  ru: { translation: ru },
  pt: { translation: pt },
  de: { translation: de },
  ja: { translation: ja }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;

// RTL languages
export const RTL_LANGUAGES = ['ar'];

export function isRTL(language: string): boolean {
  return RTL_LANGUAGES.includes(language);
}

export function getDirection(language: string): 'ltr' | 'rtl' {
  return isRTL(language) ? 'rtl' : 'ltr';
}
