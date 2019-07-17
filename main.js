import { useContext } from 'preact/hooks';
import { TranslateContext } from './lib/main';

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
