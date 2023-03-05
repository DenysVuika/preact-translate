import { LanguageData } from './languageData';
import { TranslateParams } from './translateParams';

export function getResourceUrl(root: string, lang: string): string {
  return [root, !root || root.endsWith('/') ? '' : '/', lang, '.json'].join('');
}

export function format(str: string, params?: TranslateParams): string {
  let result = str;

  if (params) {
    Object.keys(params).forEach((key) => {
      const value = params[key];
      const template = new RegExp(`{${key}}`, 'gm');

      result = result.replace(template, value.toString());
    });
  }

  return result;
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
