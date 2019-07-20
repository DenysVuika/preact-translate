import { h } from 'preact';
import { cleanup, render } from 'preact-testing-library';
import { useContext } from 'preact/hooks';
import { TranslateContext, TranslateProvider } from './translateProvider';

const Text = (props: { testId: string; valueKey: string; params?: any }) => {
  const { t } = useContext(TranslateContext);
  return (
    <div data-testid={props.testId}>{t(props.valueKey, props.params)}</div>
  );
};

describe('TranslateProvider', () => {
  afterEach(cleanup);

  it('matches snapshot', () => {
    expect(
      render(
        <TranslateProvider>
          <div />
        </TranslateProvider>
      )
    ).toMatchSnapshot();
  });

  it('translates a string', async () => {
    const data = {
      en: {
        hello: 'hey there'
      }
    };

    const { getByTestId } = render(
      <TranslateProvider translations={data}>
        <Text testId="output" valueKey="hello" />
      </TranslateProvider>
    );

    const value: any = await getByTestId('output');
    expect(value.textContent).toBe('hey there');
  });

  it('translates a nested string', async () => {
    const data = {
      en: {
        messages: {
          404: 'Not found'
        }
      }
    };

    const { getByTestId } = render(
      <TranslateProvider translations={data}>
        <Text testId="output" valueKey="messages.404" />
      </TranslateProvider>
    );

    const value: any = await getByTestId('output');
    expect(value.textContent).toBe('Not found');
  });

  it('uses custom language', async () => {
    const data = {
      en: {
        messages: {
          404: 'Not found'
        }
      },
      ua: {
        messages: {
          404: '[ua] Not found'
        }
      }
    };

    const { getByTestId } = render(
      <TranslateProvider translations={data} lang="ua">
        <Text testId="output" valueKey="messages.404" />
      </TranslateProvider>
    );

    const value: any = await getByTestId('output');
    expect(value.textContent).toBe('[ua] Not found');
  });

  it('falls back to default language', async () => {
    const data = {
      en: {
        messages: {
          404: 'Not found'
        }
      },
      ua: {
        messages: {}
      }
    };

    const { getByTestId } = render(
      <TranslateProvider translations={data} lang="ua">
        <Text testId="output" valueKey="messages.404" />
      </TranslateProvider>
    );

    const value: any = await getByTestId('output');
    expect(value.textContent).toBe('Not found');
  });

  it('renders formatted translation', async () => {
    const data = {
      en: {
        emailCount: 'Email count: {count}'
      }
    };

    const { getByTestId } = render(
      <TranslateProvider translations={data}>
        <Text testId="output" valueKey="emailCount" params={{ count: 255 }} />
      </TranslateProvider>
    );

    const value: any = await getByTestId('output');
    expect(value.textContent).toBe('Email count: 255');
  });
});
