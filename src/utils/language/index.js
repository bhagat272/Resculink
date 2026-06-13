import i18next from 'i18next';
import en from './en.json';
import es from './es.json';
import {initReactI18next} from 'react-i18next';
import {NativeModules} from 'react-native';

export const languageResources = {
  en: {translation: en},
  es: {translation: es},
};

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'en',
  fallbackLng: 'en',
  resources: languageResources,
});

export const translateLanguage = lang => {
  const selectedLanguage = lang ? lang : 'en';
  setGlobalLanguage(selectedLanguage);
  i18next.changeLanguage(lang);
};

export const methodDetectDeviceLanguage = () => {
  const deviceLanguage =
    Platform.OS == 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0]
      : NativeModules.I18nManager.localeIdentifier;
  const strFirstTwo = deviceLanguage.substring(0, 2);
  const phoneDefaultLanguage = strFirstTwo.toLowerCase();

  if (phoneDefaultLanguage != 'es' && phoneDefaultLanguage != 'en') {
    return 'en';
  }

  return phoneDefaultLanguage;
};

export const setGlobalLanguage = language => {
  global.language = language;
};

export const translateText = text => {
  return i18next.t(text);
};

export default i18next;


