import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { config } from 'dotenv';
import Page from '../components/Page';

const { PROXY_PORT } = config().parsed;

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
    const appRoot = uuid();
    const initialState = await getInitialState(req, appRoot);
    const helmet = (
      <Helmet>
        <script src={`http://localhost:${PROXY_PORT}/hot-reload-server/bundle.js`} />
        <html lang={initialState.server.lang} />
      </Helmet>
    );
    const markup = renderToStaticMarkup(helmet);
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
    res.send(html.trim());
  } catch (e) {
    next(e);
  }
}
