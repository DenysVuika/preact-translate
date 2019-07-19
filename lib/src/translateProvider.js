import { h } from 'preact';
import { createContext } from 'preact';
import useTranslate from './useTranslate';

const TranslateContext = createContext();

const defaultOptions = {
  root: 'assets',
  lang: 'en'
};

const TranslateProvider = props => {
  const { t, setLang, lang, isReady } = useTranslate({
    root: props.root || defaultOptions.root,
    lang: props.lang || defaultOptions.lang
  });

  return (
    <TranslateContext.Provider
      value={{
        t,
        setLang,
        lang,
        isReady
      }}
    >
      {props.children}
    </TranslateContext.Provider>
  );
};

export { TranslateProvider, TranslateContext };
