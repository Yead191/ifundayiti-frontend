const dictionaries = {
  en: () => import("../../public/locales/en/common.json").then((module) => module.default),
  ht: () => import("../../public/locales/ht/common.json").then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (locale: string) => {
  const activeLocale = hasLocale(locale) ? locale : "en";
  return dictionaries[activeLocale]();
};
