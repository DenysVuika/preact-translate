import { useState, useEffect } from 'preact/hooks';

const data = {};
const defaultOptions = {
  root: 'assets'
};

export default function useTranslate(options) {
  const opts = Object.assign({}, defaultOptions, options);

  const [lang, setLang] = useState('en');
  const [, setValue] = useState(data);
  const [isReady, setReady] = useState(false);

  const loadData = lang => {
    if (!data.hasOwnProperty(lang) || Object.keys(data[lang]).length === 0) {
      setReady(false);

      fetch(`${opts.root}/${lang}.json`)
        .then(results => results.json())
        .then(resource => {
          console.log(resource);
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

  const t = key => {
    if (data.hasOwnProperty(lang)) {
      const translated = data[lang][key] || data['en'][key] || key;
      return translated;
    }
    return key;
  };

  return { lang, setLang, t, isReady };
}
