import { h } from 'preact';
import { render } from 'preact-testing-library';
import { TranslateProvider } from './translateProvider';

describe('TranslateProvider', () => {
  it('matches snapshot', () => {
    expect(
      render(
        <TranslateProvider>
          <div />
        </TranslateProvider>
      )
    ).toMatchSnapshot();
  });
});
