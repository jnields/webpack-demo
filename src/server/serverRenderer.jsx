import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import fs from 'fs';
import Page from '../components/Page';
import createStore from '../util/createStore';
import AppContainer from '../containers/AppContainer';
import reducers from '../reducers';

const manifest = JSON.parse(fs.readFileSync('./build/manifest.json'));
const scripts = [
  'manifest.js',
  'core1.js',
  'core2.js',
  'main.js',
].map(src => <script key={src} src={manifest[src]} />);

async function getInitialState(req, appRoot) {
  return {
    server: {
      appRoot,
      lang: 'en-US',
    },
  };
}

function uuid() {
  const result = [];
  for (let i = 0; i < 26; i += 1) {
    result.push(Math.floor(Math.random() * 32).toString(32));
  }
  return result.join('');
}

export default async function (req, res, next) {
  try {
    const history = {};
    const appRoot = uuid();
    const initialState = await getInitialState(req, appRoot);
    const helmet = (
      <Helmet>
        {scripts}
        <html lang={initialState.server.lang} />
      </Helmet>
    );
    let markup = '';
    const store = createStore(reducers, initialState, history);
    store.dispatch({ type: '__INIT_STATE__' });
    markup = renderToString(
      <Provider store={store}>
        <StaticRouter context={history} location={req.url}>
          <AppContainer>
            {helmet}
          </AppContainer>
        </StaticRouter>
      </Provider>,
    );
    const html = renderToStaticMarkup(
      <Page
        {...{
          helmet: Helmet.renderStatic(),
          appRoot,
          markup,
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
