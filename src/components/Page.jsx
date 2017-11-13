/* eslint-disable react/no-danger */
import React from 'react';
import { arrayOf, node, string, shape, func } from 'prop-types';
import stateShape from '../util/stateShape';

export default function Page({
  initialState,
  markup,
  appRoot,
  scripts,
  helmet: {
    base,
    bodyAttributes,
    htmlAttributes,
    link,
    meta,
    noscript,
    script,
    style,
    title,
  },
}) {
  const { lang, ...rest } = htmlAttributes.toComponent();
  return (
    <html lang={lang} {...rest}>
      <head>
        {title.toComponent()}
        {meta.toComponent()}
        {link.toComponent()}
        {style.toComponent()}
        {base.toComponent()}
      </head>
      <body {...bodyAttributes.toComponent()}>
        {noscript.toComponent()}
        <div
          id={appRoot}
          dangerouslySetInnerHTML={{ __html: markup }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.INITIAL_STATE=${
              JSON.stringify(initialState)
                .replace(/</g, `\\u${'<'.charCodeAt(0)}`)
            };`,
          }}
        />
        {scripts}
        {script.toComponent()}
      </body>
    </html>
  );
}

Page.propTypes = {
  appRoot: string.isRequired,
  markup: string.isRequired,
  initialState: stateShape.isRequired,
  scripts: arrayOf(node).isRequired,
  helmet: shape({
    bodyAttributes: shape({
      toComponent: func.isRequired,
    }).isRequired,
    htmlAttributes: shape({
      toComponent: func.isRequired,
    }).isRequired,
    link: shape({
      toComponent: func.isRequired,
    }).isRequired,
    meta: shape({
      toComponent: func.isRequired,
    }).isRequired,
    noscript: shape({
      toComponent: func.isRequired,
    }).isRequired,
    script: shape({
      toComponent: func.isRequired,
    }).isRequired,
    style: shape({
      toComponent: func.isRequired,
    }).isRequired,
    title: shape({
      toComponent: func.isRequired,
    }).isRequired,
    base: shape({
      toComponent: func.isRequired,
    }).isRequired,
  }).isRequired,
};
