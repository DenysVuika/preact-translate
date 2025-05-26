import {
  TranslateContext,
  TranslateProvider,
} from '@denysvuika/preact-translate';
import { useContext } from 'preact/hooks';
import './style';

function MainComponent() {
  const { setLang, t, lang } = useContext(TranslateContext);

  return (
    <div>
      <div>Lang: {lang}</div>
      <div>{t('title')}</div>
      <div>{t('subtitle')}</div>
      <div>Formatted: {t('hello', { name: 'Bob' })}</div>
      <div>Fallback: {t('fallback')}</div>
      <div>Nested: {t('messages.errors.404')}</div>
      <div>
        <button onClick={() => setLang('en')}>EN</button>
        <button onClick={() => setLang('ua')}>UA</button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <TranslateProvider>
      <MainComponent />
    </TranslateProvider>
  );
}
