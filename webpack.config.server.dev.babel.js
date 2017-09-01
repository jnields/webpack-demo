import path from 'path';
import nodeExternals from 'webpack-node-externals';
import { config } from 'dotenv';

config();

export default {
  entry: ['babel-polyfill', './src/server/index.dev.js'],
  output: {
    path: path.resolve('./build'),
    publicPath: '/public/',
    filename: 'server.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  externals: [
    nodeExternals({
      whiteList: [/\.(?!(jsx?$|json$))/i],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve('./src'),
        use: 'babel-loader?forceEnv=server',
      },
    ],
  },
  plugins: [],
  target: 'node',
};
