import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import createHistory from 'history/createBrowserHistory';
import createStore from '../util/createStore';
import AppContainer from '../containers/AppContainer';
import reducers from '../reducers';

const history = createHistory();
const initialState = window.INITIAL_STATE;
const store = createStore(reducers, window.INITIAL_STATE);

function renderApp() {
  render(
    <Provider store={store}>
      <Router history={history}>
        <AppContainer />
      </Router>
    </Provider>,
    document.getElementById(initialState.server.appRoot),
  );
}
renderApp();

if (module.hot) {
  module.hot.accept('../reducers', () => {
    try {
      delete require.cache[require.resolve('../reducers')];
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
