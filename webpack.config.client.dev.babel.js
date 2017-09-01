import path from 'path';
import { config } from 'dotenv';
import webpack from 'webpack';

const { PORT, PROXY_PORT } = config().parsed;

export default {
  entry: [
    'babel-polyfill',
    './src/client',
  ],
  output: {
    path: path.resolve('./build/public'),
    filename: 'bundle.js',
    publicPath: `http://localhost:${PROXY_PORT}/hot-reload-server/`,
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
        use: [
          'react-hot-loader',
          'babel-loader?forceEnv=client',
        ],
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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"',
    }),
  ],
  devServer: {
    hot: true,
    port: PROXY_PORT,
    contentBase: path.resolve('./build/public'),
    publicPath: `http://localhost:${PROXY_PORT}/hot-reload-server/`,
    headers: {
      'Access-Control-Allow-Origin': `http://localhost:${PORT}`,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
};
