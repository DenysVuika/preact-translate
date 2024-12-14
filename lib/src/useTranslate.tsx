import { useEffect, useState } from 'preact/hooks';
import { LanguageData } from './languageData';
import { TranslateOptions } from './translateOptions';
import { type TranslateParam, type TranslateParams } from './translateParams';
import { format, getResourceUrl, getValue } from './utils';

let cache: LanguageData = {};

const defaultOptions: TranslateOptions = {
  root: '',
  lang: 'en',
  fallbackLang: 'en'
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

  const loadData = (langKey: string) => {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(langKey)) {
      return;
    }

    setReady(false);

    const url = getResourceUrl(options.root, langKey);

    fetch(url)
      .then(results => results.json())
      .then(resource => {
        cache[langKey] = resource;
        setData({ ...cache });
        setReady(true);
      })
      .catch(error => {
        console.log('Aww, snap.', error);
        setData({ ...cache });
        setReady(true);
      });
  };

  useEffect(() => {
    loadData(options.fallbackLang);
    loadData(lang);
  }, [lang]);

  const t = <T,>(key: string, params?: TranslateParams<TranslateParam>): T => {
    // eslint-disable-next-line no-prototype-builtins
    if (!data.hasOwnProperty(lang)) {
      return key as T;
    }

    let value = getValue(data, lang, key);
    if (value === key && lang !== options.fallbackLang) {
      value = getValue(data, options.fallbackLang, key);
    }

    return format(value, params) as T;
  };

  return { lang, setLang, t, isReady };
}
