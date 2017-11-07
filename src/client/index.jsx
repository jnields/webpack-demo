/* eslint-env commonjs */
/* global process */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import createStore from '../util/createStore';
import AppContainer from '../containers/AppContainer';
import reducers from '../reducers';

const history = createBrowserHistory();
const initialState = window.INITIAL_STATE;
const store = createStore({
  reducers,
  initialState: window.INITIAL_STATE,
  history,
});
delete window.INITIAL_STATE;

if (process.env.NODE_ENV === 'production') {
  ReactDOM.hydrate(
    <Provider store={store}>
      <Router history={history}>
        <AppContainer />
      </Router>
    </Provider>,
    document.getElementById(initialState.server.appRoot),
  );
} else {
  const renderApp = () => {
    ReactDOM.render(
      <Provider store={store}>
        <Router history={history}>
          <AppContainer />
        </Router>
      </Provider>,
      document.getElementById(initialState.server.appRoot),
    );
  };
  renderApp();
  if (module.hot) {
    module.hot.accept('../reducers', () => {
      try {
        delete require.cache[require.resolve('../reducers')];
        // eslint-disable-next-line global-require
        const nextReducer = require('../reducers').default;
        if (nextReducer) {
          store.replaceReducer(nextReducer);
        }
      } catch (e) {
      // ignored
      }
    });
    module.hot.accept('../containers/AppContainer.jsx', () => {
      renderApp();
    });
  }
}
