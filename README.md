# preact-translate

Minimalistic translate (i18n) library for Preact

[![Build Status](https://dev.azure.com/denysvuika/preact-translate/_apis/build/status/DenysVuika.preact-translate?branchName=master)](https://dev.azure.com/denysvuika/preact-translate/_build/latest?definitionId=3&branchName=master)

Bundle size: ~1KB  
Live example: [Sandbox](https://codesandbox.io/embed/preact-translate-npm-tpe4f)

## Installing

Minimal requirements: **Preact 10.0.0-rc.0**

Using Yarn:

```sh
yarn add @denysvuika/preact-translate
```

Using NPM:

```sh
npm i @denysvuika/preact-translate
```

## Basic usage

You should wrap your application with the `TranslateProvider` component:

```jsx
import { TranslateProvider } from '@denysvuika/preact-translate';

export default function App() {
  return (
    <TranslateProvider>
      <MainComponent />
    </TranslateProvider>
  );
}
```

Create an `assets/en.json` file with the following content:

```json
{
  "title": "Hello",
  "subtitle": "World"
}
```

Create a second file `assets/ua.json` to be able to switch between different resources.

```json
{
  "title": "[ua] Hello",
  "subtitle": "[ua] World"
}
```

You can now use the `TranslateContext` in your components to access the translation API and data:

```jsx
import { useContext } from 'preact/hooks';
import { TranslateContext } from '@denysvuika/preact-translate';

export default function MainComponent() {
  const { setLang, t, lang } = useContext(TranslateContext);

  return (
    <div>
      <div>Lang: {lang}</div>
      <div>{t('title')}</div>
      <div>{t('subtitle')}</div>
      <div>
        <button onClick={() => setLang('en')}>EN</button>
        <button onClick={() => setLang('ua')}>UA</button>
      </div>
    </div>
  );
}
```

For the `EN` locale you should see:

```text
Lang: en
Hello
World
```

For the `UA` locale you should see:

```text
Lang: ua
[ua] Hello
[ua] World
```

The language loading performs on demand.
The `en.json` gets loaded and cached only when first requested by your application.

## Configuring assets root folder

By default, the `assets` folder is used to fetch locales.
You can change it via the `TranslateProvider.root` property:

```jsx
import { TranslateProvider } from '@denysvuika/preact-translate';

export default function App() {
  return (
    <TranslateProvider root="i18n">
      <MainComponent />
    </TranslateProvider>
  );
}
```

## Formatted translations

You can use runtime string substitution when translating text

```json
{
  "hello": "Hello, {name}"
}
```

Then in the JSX:

```jsx
<div>{t('hello', { name: 'Bob' })}</div>
```

## Nested translations

The library supports complex objects with nested levels.

Put the following in the `en.json` file:

```json
{
  "messages": {
    "errors": {
      "404": "Sorry, not found"
    }
  }
}
```

Then in the JSX use:

```jsx
<div>{t('messages.errors.404')}</div>
```

You can also use composite strings like the following:

```json
{
  "messages.errors.404": "Sorry, not found"
}
```

## Default language

You can set the default language to use with the application by assigning the `TranslateProvider.lang` property.

```html
<TranslateProvider lang="ua">
  <Application />
</TranslateProvider>
```

Please note that in this case provider is going to load and cache two locales at startup:
`en.json` (as a fallback) and `ua.json` (as an active lang).

## Custom translation data

You can use `TranslateProvider.translations` property to provide a custom translation data from the code.
That helps with unit testing as well.

```jsx
const data = {
  en: {
    messages: {
      404: 'Not found'
    }
  }
};

<TranslateProvider translations={data}>
  <Application />
</TranslateProvider>;
```

Note that the `TranslateProvider` is not going to fetch translation files for the `en` locale,
and will use your custom data instead.
