import path from 'path';
import Minifier from 'babili-webpack-plugin';
import webpack from 'webpack';
import ManifestPlugin from 'webpack-manifest-plugin';

const publicPath = '/public/';

export default {
  entry: {
    main: ['babel-polyfill', './src/client'],
    core1: [
      'babel-polyfill',
      'history',
      'prop-types',
      'react',
      'react-router',
      'redux',
    ],
    core2: [
      'react-redux',
      'react-dom',
      'redux-thunk',
      'react-helmet',
    ],
  },
  output: {
    path: path.resolve('./build/public'),
    filename: '[chunkhash].js',
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
        exclude: [
          path.resolve('./node_modules'),
          path.resolve('./src/server'),
        ],
        use: 'babel-loader?forceEnv=client',
      },
      {
        test: /\.jpg$/,
        use: 'file-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['core2', 'core1'],
      filename: '[chunkhash].js',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      filename: '[chunkhash].js',
    }),
    new Minifier({
      removeConsole: true,
      removeDebugger: true,
    }),
    new ManifestPlugin({
      fileName: '../manifest.json',
      publicPath,
    }),
  ],
};
