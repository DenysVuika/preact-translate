import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { LanguageData } from './languageData';
import { TranslateOptions } from './translateOptions';
import { TranslateParams } from './translateParams';
import { format, getResourceUrl, getValue } from './utils';

let cache: LanguageData = {};

const defaultOptions: TranslateOptions = {
  root: '',
  lang: 'en',
  fallbackLang: 'en',
};

export default function useTranslate(
  options: TranslateOptions,
  translations?: LanguageData
) {
  options = Object.assign({}, defaultOptions, options);
  cache = translations || cache;

  const [lang, setLang] = useState(options.lang);
  const [data, setData] = useState(cache);
  const [isReady, setReady] = useState(false);

  const loadData = useCallback(
    async (langKey: string) => {
      if (data[langKey]) {
        return;
      }

      setReady(false);

      try {
        const url = getResourceUrl(options.root, langKey);
        const response = await fetch(url);
        cache[langKey] = await response.json();
      } catch (error) {
        console.error(`Failed to load language data for ${langKey}:`, error);
      } finally {
        setData({ ...cache });
        setReady(true);
      }
    },
    [data, options.root]
  );

  useEffect(() => {
    const loadLanguages = async () => {
      await loadData(options.fallbackLang);
      await loadData(lang);
    };
    void loadLanguages();
  }, [lang, loadData, options.fallbackLang]);

  const t = useMemo(
    () => (key: string, params?: TranslateParams) => {
      // eslint-disable-next-line no-prototype-builtins
      if (!data.hasOwnProperty(lang)) {
        return key;
      }

      let value = getValue(data, lang, key);
      if (value === key && lang !== options.fallbackLang) {
        value = getValue(data, options.fallbackLang, key);
      }

      return format(value, params);
    },
    [data, lang, options.fallbackLang]
  );

  return { lang, setLang, t, isReady };
}
