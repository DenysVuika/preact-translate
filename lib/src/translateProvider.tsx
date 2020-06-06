import { Context, createContext, h } from 'preact';
import { LanguageData } from './languageData';
import { TranslateOptions } from './translateOptions';
import useTranslate from './useTranslate';

const TranslateContext = createContext(null) as Context<
  ReturnType<typeof useTranslate>
>;

const defaultOptions: TranslateOptions = {
  root: 'assets',
  lang: 'en'
};

export interface TranslateProviderProps {
  root?: string;
  lang?: string;
  fallbackLang?: string;
  translations?: LanguageData;
  children?: any;
}

const TranslateProvider = (props: TranslateProviderProps) => {
  const { t, setLang, lang, isReady } = useTranslate(
    {
      root: props.root || defaultOptions.root,
      lang: props.lang || defaultOptions.lang,
      fallbackLang: props.fallbackLang || defaultOptions.fallbackLang
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
