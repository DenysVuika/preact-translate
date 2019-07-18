import './style';
import { TranslateProvider } from '@denysvuika/preact-translate';
import MainComponent from './main';

export default function App() {
  return (
    <TranslateProvider>
      <MainComponent />
    </TranslateProvider>
  );
}
