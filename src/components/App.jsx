import React from 'react';
import { Switch, Route } from 'react-router';
import routes from '../config/routes';

export default function App() {
  return (
    <Switch>
      {routes.map(route => <Route {...route} />)}
    </Switch>
  );
}
