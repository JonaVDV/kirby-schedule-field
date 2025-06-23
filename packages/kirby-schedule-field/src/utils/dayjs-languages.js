/**
 * @param {LocaleKey} locale
 * @todo Add more locales
 *
 */
const getLocale = async (locale) => {
  /**
   * @typedef {keyof typeof localeMap | (string & {})} LocaleKey
   */
  const localeMap = {
    en: () => import("dayjs/locale/en.js"),
    nl: () => import("dayjs/locale/nl.js"),
    de: () => import("dayjs/locale/de.js"),
    fr: () => import("dayjs/locale/fr.js"),
    es: () => import("dayjs/locale/es.js"),
  };

  try {
    const importFn = localeMap[/** @type {keyof typeof localeMap} */ (locale)];
    if (importFn) {
      const module = await importFn();
      console.log(`Loading locale: ${locale}`);
      return module.default;
    } else {
      console.warn(`Locale ${locale} not supported, falling back to 'en'`);
      const module = await localeMap.en();
      return module.default;
    }
  } catch (error) {
    console.error(`Error loading locale ${locale}:`, error);
    try {
      const module = await localeMap.en();
      return module.default;
    } catch (fallbackError) {
      console.error("Failed to load fallback locale:", fallbackError);
      return null;
    }
  }
};

export { getLocale };
