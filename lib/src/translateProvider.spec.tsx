import { cleanup, fireEvent, render } from '@testing-library/preact';
import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { TranslateContext, TranslateProvider } from './translateProvider';

declare const global: any;

const Text = (props: { testId: string; valueKey: string; params?: any }) => {
  const { t } = useContext(TranslateContext);
  return (
    <div data-testid={props.testId}>{t(props.valueKey, props.params)}</div>
  );
};

const LangButton = (props) => {
  const { setLang } = useContext(TranslateContext);
  return (
    <button data-testid="changeLang" onClick={() => setLang(props.lang)}>
      {props.lang}
    </button>
  );
};

describe('TranslateProvider', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () => {
          /* */
        },
      });
    });
  });

  afterEach(cleanup);

  test('matches snapshot', () => {
    expect(
      render(
        <TranslateProvider translations={{}}>
          <div />
        </TranslateProvider>
      )
    ).toMatchSnapshot();
  });

  test('translates a string', async () => {
    const data = {
      en: {
        hello: 'hey there',
      },
    };

    const { getByTestId } = render(
      <TranslateProvider translations={data}>
        <Text testId="output" valueKey="hello" />
      </TranslateProvider>
    );

    const value = getByTestId('output');
    expect(value.textContent).toBe('hey there');
  });

  test('translates a nested string', async () => {
    const data = {
      en: {
        messages: {
          404: 'Not found',
        },
      },
    };

    const { getByTestId } = render(
      <TranslateProvider translations={data}>
        <Text testId="output" valueKey="messages.404" />
      </TranslateProvider>
    );

    const value = getByTestId('output');
    expect(value.textContent).toBe('Not found');
  });

  test('translates a composite string', async () => {
    const data = {
      en: {
        'messages.errors.404': 'Not found',
      },
    };

    const { getByTestId } = render(
      <TranslateProvider translations={data}>
        <Text testId="output" valueKey="messages.errors.404" />
      </TranslateProvider>
    );

    const value = getByTestId('output');
    expect(value.textContent).toBe('Not found');
  });

  test('uses custom language', async () => {
    const data = {
      en: {
        messages: {
          404: 'Not found',
        },
      },
      ua: {
        messages: {
          404: '[ua] Not found',
        },
      },
    };

    const { getByTestId } = render(
      <TranslateProvider translations={data} lang="ua">
        <Text testId="output" valueKey="messages.404" />
      </TranslateProvider>
    );

    const value = getByTestId('output');
    expect(value.textContent).toBe('[ua] Not found');
  });

  test('falls back to default language', async () => {
    const data = {
      en: {
        messages: {
          404: 'Not found',
        },
      },
      ua: {
        messages: {},
      },
    };

    const { getByTestId } = render(
      <TranslateProvider translations={data} lang="ua">
        <Text testId="output" valueKey="messages.404" />
      </TranslateProvider>
    );

    const value = getByTestId('output');
    expect(value.textContent).toBe('Not found');
  });

  test('renders formatted translation', async () => {
    const data = {
      en: {
        emailCount: 'Email count: {count}',
      },
    };

    const { getByTestId } = render(
      <TranslateProvider translations={data}>
        <Text testId="output" valueKey="emailCount" params={{ count: 255 }} />
      </TranslateProvider>
    );

    const value = getByTestId('output');
    expect(value.textContent).toBe('Email count: 255');
  });

  test('renders translation key when data not found', async () => {
    const data = {};

    const { getByTestId } = render(
      <TranslateProvider translations={data}>
        <Text testId="output" valueKey="hello" />
      </TranslateProvider>
    );

    const value = getByTestId('output');
    expect(value.textContent).toBe('hello');
  });

  test('updates translation on language change', async () => {
    const data = {
      en: {
        messages: {
          404: 'Not found',
        },
      },
      ua: {
        messages: {
          404: '[ua] Not found',
        },
      },
    };

    const { getByTestId } = render(
      <TranslateProvider translations={data}>
        <Text testId="output" valueKey="messages.404" />
        <LangButton lang="ua" />
      </TranslateProvider>
    );

    const value = getByTestId('output');
    expect(value.textContent).toBe('Not found');

    const button = getByTestId('changeLang');
    fireEvent.click(button);

    expect(value.textContent).toBe('[ua] Not found');
  });
});
