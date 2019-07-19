import { useEffect, useState } from 'preact/hooks';
import { TranslateOptions } from './translateOptions';

const data = {};
const defaultOptions: TranslateOptions = {
  root: '',
  lang: 'en',
  fallbackLang: 'en'
};

export default function useTranslate(options: TranslateOptions) {
  options = Object.assign({}, defaultOptions, options);

  const [lang, setLang] = useState(options.lang);
  const [, setValue] = useState(data);
  const [isReady, setReady] = useState(false);

  const loadData = (langKey: string) => {
    if (data.hasOwnProperty(langKey) && Object.keys(data[langKey]).length > 0) {
      return;
    }
    // if (
    //   !data.hasOwnProperty(langKey) ||
    //   Object.keys(data[langKey]).length === 0
    // ) {
    setReady(false);

    const url = getLangUrl(options.root, langKey);

    fetch(url)
      .then(results => results.json())
      .then(resource => {
        data[langKey] = resource;
        setValue({ ...data });
        setReady(true);
      })
      .catch(error => {
        console.log('Aww, snap.', error);
        setValue({ ...data });
        setReady(true);
      });
    // }
  };

  useEffect(() => {
    loadData(options.fallbackLang);
    loadData(lang);
  }, [lang]);

  const t = (key: string, params: any) => {
    if (!data.hasOwnProperty(lang)) {
      return key;
    }

    const value = data[lang][key] || data[options.fallbackLang][key] || key;
    return format(value, params);
  };

  return { lang, setLang, t, isReady };
}

function format(str: string, params: any): string {
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
