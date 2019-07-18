import { useState, useEffect } from 'preact/hooks';

const data = {};
const defaultOptions = {
  root: ''
};

export default function useTranslate(options) {
  let rootPath = (options || {}).root || defaultOptions.root;
  if (!rootPath.endsWith('/')) {
    rootPath += '/';
  }

  const [lang, setLang] = useState('en');
  const [, setValue] = useState(data);
  const [isReady, setReady] = useState(false);

  const loadData = lang => {
    if (!data.hasOwnProperty(lang) || Object.keys(data[lang]).length === 0) {
      setReady(false);

      fetch(`${rootPath}${lang}.json`)
        .then(results => results.json())
        .then(resource => {
          // console.log(resource);
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
    loadData(lang);
  }, [lang]);

  const t = (key, params) => {
    if (!data.hasOwnProperty(lang)) {
      return key;
    }

    const value = data[lang][key] || data['en'][key] || key;
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
