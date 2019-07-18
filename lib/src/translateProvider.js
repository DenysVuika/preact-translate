import { h } from 'preact';
import { createContext } from 'preact';
import useTranslate from './useTranslate';

const TranslateContext = createContext();

const defaultOptions = {
  root: 'assets'
};

const TranslateProvider = props => {
  const { t, setLang, lang, isReady } = useTranslate({
    root: props.root || defaultOptions.root
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
