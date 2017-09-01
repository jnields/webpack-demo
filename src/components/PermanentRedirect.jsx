import React from 'react';
import { Route, Redirect } from 'react-router';
import { string, shape, number } from 'prop-types';

function createClass({ from, to }) {
  function RedirectWrapper({ staticContext }) {
    if (staticContext) {
      Object.assign(staticContext, { status: 301 });
    }
    return <Redirect from={from} to={to} />;
  }

  RedirectWrapper.propTypes = {
    staticContext: shape({
      url: string,
      status: number,
    }),
  };
  RedirectWrapper.defaultProps = {
    staticContext: undefined,
  };

  return RedirectWrapper;
}

export default function PermanentRedirect({ from, to }) {
  return <Route render={createClass({ from, to })} />;
}

PermanentRedirect.propTypes = {
  from: string.isRequired,
  to: string.isRequired,
};
