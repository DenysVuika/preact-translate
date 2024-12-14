import { format, getResourceUrl, getValue } from './utils';

describe('Utils', () => {
  describe('getResourceUrl', () => {
    test('formats resource url', () => {
      expect(getResourceUrl('/assets', 'en')).toBe('/assets/en.json');
    });

    test('takes into account trailing slash', () => {
      expect(getResourceUrl('/assets/', 'en')).toBe('/assets/en.json');
    });

    test('does not append slash for empty root', () => {
      expect(getResourceUrl('', 'en')).toBe('en.json');
    });
  });

  describe('format', () => {
    test('returns input string if params are missing', () => {
      expect(format('hello')).toBe('hello');
    });

    test('substitutes the value from params', () => {
      const value = format('hello, {name}', { name: 'world' });
      expect(value).toBe('hello, world');
    });

    test('substitutes multiple params', () => {
      const template = 'Good luck, {param1} {param2}!';
      const params = {
        param1: 'Mr.',
        param2: 'Gorsky'
      };

      const value = format(template, params);
      expect(value).toBe('Good luck, Mr. Gorsky!');
    });

    test('substitutes numbers from params', () => {
      const template = 'Email count: {count}';
      const params = { count: 255 };

      const value = format(template, params);
      expect(value).toBe('Email count: 255');
    });
  });

  describe('getValue', () => {
    test('returns original key if language data missing', () => {
      const value = getValue({}, 'en', 'hello');
      expect(value).toBe('hello');
    });

    test('returns top-level value', () => {
      const data = { en: { hello: 'hello, world' } };
      const value = getValue(data, 'en', 'hello');
      expect(value).toBe('hello, world');
    });

    test('returns nested value', () => {
      const data = {
        en: {
          messages: {
            404: 'Error, not found.'
          }
        }
      };

      const value = getValue(data, 'en', 'messages.404');
      expect(value).toBe('Error, not found.');
    });

    test('returns original key if nested value not found', () => {
      const data = {
        en: {
          messages: {}
        }
      };

      const value = getValue(data, 'en', 'messages.500');
      expect(value).toBe('messages.500');
    });

    test('supports tol-level values with dots', () => {
      const data = {
        en: {
          'messages.errors.500': 'Aw, snap!'
        }
      };

      const value = getValue(data, 'en', 'messages.errors.500');
      expect(value).toBe('Aw, snap!');
    });
  });
});
