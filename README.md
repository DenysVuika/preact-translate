# preact-translate

Minimalistic translate (i18n) library for Preact

## Installing

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
    <TranslateProvider root="assets">
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
