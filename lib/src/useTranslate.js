import { useState, useEffect } from 'preact/hooks';

const data = {};
const defaultOptions = {
  root: '',
  lang: 'en',
  fallbackLang: 'en'
};

export default function useTranslate(options) {
  options = Object.assign({}, defaultOptions, options);

  const [lang, setLang] = useState(options.lang);
  const [, setValue] = useState(data);
  const [isReady, setReady] = useState(false);

  const loadData = lang => {
    if (!data.hasOwnProperty(lang) || Object.keys(data[lang]).length === 0) {
      setReady(false);

      const url = getLangUrl(options.root, lang);

      fetch(url)
        .then(results => results.json())
        .then(resource => {
          data[lang] = resource;
          setValue({ ...data });
          setReady(true);
        })
        .catch(error => {
          console.log('Aww, snap.', error);
          setValue({ ...data });
          setReady(true);
        });
    }
  };

  useEffect(() => {
    loadData(options.fallbackLang);
    loadData(lang);
  }, [lang]);

  const t = (key, params) => {
    if (!data.hasOwnProperty(lang)) {
      return key;
    }

    const value = data[lang][key] || data[options.fallbackLang][key] || key;
    return format(value, params);
  };

  return { lang, setLang, t, isReady };
}

function format(str, params) {
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

function getLangUrl(root, lang) {
  return [root, root.endsWith('/') ? '' : '/', lang, '.json'].join('');
}
