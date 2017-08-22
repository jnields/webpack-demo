import path from 'path';
import nodeExternals from 'webpack-node-externals';
import Minifier from 'babili-webpack-plugin';

export default {
  entry: ['babel-polyfill', './src/server'],
  output: {
    path: path.resolve('.'),
    filename: 'server.js',
    publicPath: '/static/',
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve('./src'),
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    new Minifier({ removeDebugger: true }),
  ],
  target: 'node',
};
