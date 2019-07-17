import './style';
import { Component } from 'preact';
import { TranslateProvider } from './lib/main';
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
