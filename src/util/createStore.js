import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { routeChanged } from '../actions';

export default function ({
  reducers,
  initialState,
  history,
  async = false,
}) {
  const store = createStore(
    reducers,
    initialState,
    applyMiddleware(
      thunk,
    ),
  );

  const listener = (location, action) => {
    const result = routeChanged({ location, action });
    store.dispatch(result);
    return result;
  };

  history.listen(listener);

  return async
    ? Promise.resolve(listener(history.location, 'INIT')).then(() => store)
    : store;
}
