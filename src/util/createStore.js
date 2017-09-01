import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

export default function (reducers, initialState) {
  const store = createStore(
    reducers,
    initialState,
    applyMiddleware(
      thunk,
    ),
  );
  return store;
}
