import { useEffect, useState } from 'preact/hooks';
import { TranslateOptions } from './translateOptions';

interface LanguageData {
  [key: string]: any;
}

export interface TranslateParams {
  [key: string]: string | number;
}

const cache: LanguageData = {};

const defaultOptions: TranslateOptions = {
  root: '',
  lang: 'en',
  fallbackLang: 'en'
};

export default function useTranslate(options: TranslateOptions) {
  options = Object.assign({}, defaultOptions, options);

  const [lang, setLang] = useState(options.lang);
  const [data, setData] = useState(cache);
  const [isReady, setReady] = useState(false);

  const loadData = (langKey: string) => {
    if (data.hasOwnProperty(langKey) && Object.keys(data[langKey]).length > 0) {
      return;
    }

    setReady(false);

    const url = getLangUrl(options.root, langKey);

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

  const t = (key: string, params: TranslateParams) => {
    if (!data.hasOwnProperty(lang)) {
      return key;
    }

    let value = getValue(data, lang, key);
    if (value === key && lang !== options.fallbackLang) {
      value = getValue(data, options.fallbackLang, key);
    }

    return format(value, params);
  };

  return { lang, setLang, t, isReady };
}

function format(str: string, params: TranslateParams): string {
  let result = str;

  if (params) {
    Object.keys(params).forEach(key => {
      const value = params[key];
      const template = new RegExp('{' + key + '}', 'gm');

      result = result.replace(template, value.toString());
    });
  }

  return result;
}

function getLangUrl(root: string, lang: string): string {
  return [root, root.endsWith('/') ? '' : '/', lang, '.json'].join('');
}

function getValue(
  languageData: LanguageData,
  lang: string,
  key: string
): string {
  let localeData = languageData[lang];

  if (!localeData) {
    return key;
  }

  const keys = key.split('.');
  let propKey = '';

  do {
    propKey += keys.shift();
    const value = localeData[propKey];
    if (value !== undefined && (typeof value === 'object' || !keys.length)) {
      localeData = value;
      propKey = '';
    } else if (!keys.length) {
      localeData = key;
    } else {
      propKey += '.';
    }
  } while (keys.length);

  return localeData;
}
