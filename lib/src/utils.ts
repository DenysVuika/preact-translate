import { LanguageData } from './languageData';
import { type TranslateParam, type TranslateParams } from './translateParams';
import { type JSX } from "preact";

export function getResourceUrl(root: string, lang: string): string {
  return [root, !root || root.endsWith('/') ? '' : '/', lang, '.json'].join('');
}

export type FormatReturnType<T> = T extends JSX.Element ? T[] : string;

export function format<T extends TranslateParam>(str: string, params?: TranslateParams<T>): FormatReturnType<T> {
  if (params && Object.values(params).some(param => typeof param === 'object')) {
    const separators = Object.keys(params).map(key => `{${key}}`).join(`|`);
    const regex = new RegExp(`(?=${separators})|(?<=${separators})`, `g`);

    return str.split(regex).map(part => {
      if (/^{[^{}]+}$/.test(part)) {
        const withoutBraces = part.substring(1, part.length - 1);
        return params[withoutBraces] ? params[withoutBraces] : part;
      } else {
        return part;
      }
    }) as FormatReturnType<T>;
  }

  let result = str;

  if (params) {
    Object.keys(params).forEach((key) => {
      const value = params[key];
      const template = new RegExp(`{${key}}`, 'gm');

      result = result.replace(template, value.toString());
    });
  }

  return result as FormatReturnType<T>;
}

export function getValue(
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
