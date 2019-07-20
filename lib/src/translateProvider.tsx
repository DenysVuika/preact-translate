import { createContext, h } from 'preact';
import { LanguageData } from './languageData';
import { TranslateOptions } from './translateOptions';
import useTranslate from './useTranslate';

const TranslateContext = createContext(null);

const defaultOptions: TranslateOptions = {
  root: 'assets',
  lang: 'en'
};

export interface TranslateProviderProps {
  root?: string;
  lang?: string;
  translations?: LanguageData;
  children?: any;
}

const TranslateProvider = (props: TranslateProviderProps) => {
  const { t, setLang, lang, isReady } = useTranslate(
    {
      root: props.root || defaultOptions.root,
      lang: props.lang || defaultOptions.lang
    },
    props.translations
  );

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
