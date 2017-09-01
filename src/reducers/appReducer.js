import routes from '../config/routes';

const initialState = {
  routes,
};

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    default: return state;
  }
}
