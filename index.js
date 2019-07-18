import './style';
import { Component } from 'preact';
import { TranslateProvider } from '@denysvuika/preact-translate';
import MainComponent from './main';

export default class App extends Component {
  render() {
    return (
      <TranslateProvider root="assets">
        <div>
          <MainComponent />
        </div>
      </TranslateProvider>
    );
  }
}
