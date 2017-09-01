import React from 'react';
import { node } from 'prop-types';
import { Route, Switch } from 'react-router';
import routes from '../config/routes';

export default function App({ children }) {
  return (
    <Switch>
      {children}
      {routes.map(route => <Route key={route.path} {...route} />)}
    </Switch>
  );
}
App.propTypes = {
  children: node,
};

App.defaultProps = {
  children: undefined,
};
