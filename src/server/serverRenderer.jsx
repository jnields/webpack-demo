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
import UniversalComponent from '../components/UniversalComponent';
import reducers from '../reducers';

const webpackStats = JSON.parse(fs.readFileSync('./build/stats.json'));

const {
  entrypoints: { main },
  publicPath,
  assetsByChunkName,
  modules,
} = webpackStats;

const clientModuleChunks = modules.reduce(
  (result, m) => ({ ...result, [m.id]: m.chunks }),
  {},
);

const getFilesByModuleId =
  ms => ms
    .reduce((chunks, id) => [...chunks, ...clientModuleChunks[id]], [])
    .filter((chunk, ix, self) => self.indexOf(chunk) === ix) // unique
    .map(chunk => publicPath + assetsByChunkName[chunk])
    .map(src => <script src={src} key={src} />);


const baseScripts = main
  .assets
  .map(src => <script src={publicPath + src} key={publicPath + src} />);


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
    const store = await createStore({
      reducers,
      initialState,
      history,
      async: true,
    });

    const markup = renderToString(
      <Provider store={store}>
        <StaticRouter context={history} location={req.originalUrl}>
          <AppContainer />
        </StaticRouter>
      </Provider>,
    );

    const html = renderToStaticMarkup(
      <Page
        {...{
          appRoot,
          markup,
          helmet: {
            ...Helmet.renderStatic(),
          },
          scripts: (() => {
            const asyncScripts = getFilesByModuleId(UniversalComponent.getModules());
            const result = baseScripts.slice();
            const last = result.pop();
            [].push.apply(result, asyncScripts);
            result.push(last);
            return result;
          })(),
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
