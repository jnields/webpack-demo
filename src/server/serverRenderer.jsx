import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import createMemoryHistory from 'history/createMemoryHistory';
import uuid from 'uuid';
import fs from 'fs';
import Page from '../components/Page';
import createStore from '../util/createStore';
import AppContainer from '../containers/AppContainer';
import reducers from '../reducers';

const manifest = JSON.parse(fs.readFileSync('./build/manifest.json'));
const scripts = [
  'manifest.js',
  '1.js',
  '2.js',
  'main.js',
].map(src => <script key={src} src={manifest[src]} />);

const appRoot = uuid();

async function getInitialState() {
  return {
    server: {
      appRoot,
      lang: 'en-US',
    },
  };
}

export default async function (req, res, next) {
  try {
    const history = createMemoryHistory();
    const initialState = await getInitialState(req, appRoot);
    const helmet = (
      <Helmet>
        {scripts}
        <html lang={initialState.server.lang} />
      </Helmet>
    );
    const store = await createStore({
      reducers,
      initialState,
      history,
      async: true,
    });

    const html = renderToStaticMarkup(
      <Page
        {...{
          appRoot,
          markup: renderToString(
            <Provider store={store}>
              <StaticRouter context={history} location={req.url}>
                <AppContainer>
                  {helmet}
                </AppContainer>
              </StaticRouter>
            </Provider>,
          ),
          helmet: Helmet.renderStatic(),
          initialState,
        }}
      />,
    );
    if (history.url) {
      res.redirect(history.url, history.status || 302);
    } else {
      res.send(html.trim());
    }
  } catch (e) {
    next(e);
  }
}
