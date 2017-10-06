import 'babel-polyfill';
import BabelMinifyWebpackPlugin from 'babel-minify-webpack-plugin';
import OptimizeCssAssetsWebpackPlugin from 'optimize-css-assets-webpack-plugin';
import ExtractTextWebpackPlugin from 'extract-text-webpack-plugin';
import WebpackManifestPlugin from 'webpack-manifest-plugin';
import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import { config } from 'dotenv';

const outputPath = path.resolve('./build/public');
const extractCss = new ExtractTextWebpackPlugin('[chunkhash].css', { allChunks: true });

const { PORT, DEV_PORT, NODE_ENV } = config().parsed;

const postcss = {
  loader: 'postcss-loader',
  options: {
    plugins: () => [autoprefixer()],
  },
};
const prod = NODE_ENV === 'production';
const filename = `[${prod ? 'chunkhash' : 'name'}].js`;
const publicPath = '/public/';

export default {
  entry: {
    main: [
      'babel-polyfill',
      'whatwg-fetch',
      './src/client',
    ],
    1: [
      'babel-polyfill',
      'history',
      'prop-types',
      'react',
      'react-router',
      'redux',
    ],
    2: [
      'react-redux',
      'react-dom',
      'redux-thunk',
      'react-helmet',
    ],
  },
  output: {
    path: outputPath,
    filename,
    publicPath,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        include: path.resolve('./src/server'),
        use: 'null-loader',
      },
      {
        test: /\.jsx?$/,
        include: path.resolve('./src'),
        exclude: path.resolve('./node_modules'),
        use: [
          ...(prod ? [] : ['react-hot-loader']),
          'babel-loader?forceEnv=client',
        ],
      },
      {
        test: /\.jpg$/,
        use: 'file-loader',
      },
      {
        test: /\.(s[ca]|c)ss$/, // for css module styles
        include: path.resolve('./src'),
        use: (() => {
          const loaders = [
            `css-loader?modules&camelCase${prod ? '' : '&localIdentName=[path]→[name]→[local]'}`,
            postcss,
            'sass-loader',
          ];
          return prod
            ? extractCss.extract({ use: loaders })
            : ['style-loader', ...loaders];
        })(),
      },
    ],
  },
  plugins: [
    ...(prod
      ? [
        new BabelMinifyWebpackPlugin({
          removeConsole: true,
          removeDebugger: true,
        }),
        extractCss,
        new OptimizeCssAssetsWebpackPlugin(),
      ]
      : [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
      ]
    ),
    new webpack.optimize.CommonsChunkPlugin({
      names: [2, 1],
      filename,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      filename,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    }),
    new WebpackManifestPlugin({
      publicPath,
      fileName: '../manifest.json',
    }),
  ],
  devServer: {
    hot: true,
    port: DEV_PORT,
    https: true,
    contentBase: outputPath,
    publicPath,
    proxy: {
      '/': {
        target: `http://localhost:${PORT}`,
        secure: false,
        bypass: req => (req.path.startsWith(publicPath) ? req.originalUrl : false),
      },
    },
  },
};
