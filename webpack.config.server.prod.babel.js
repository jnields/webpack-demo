import path from 'path';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import Minifier from 'babili-webpack-plugin';

export default {
  entry: ['babel-polyfill', './src/server'],
  output: {
    path: path.resolve('./build'),
    filename: 'server.js',
    publicPath: '/static/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve('./src'),
        use: 'babel-loader?forceEnv=server',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
    new Minifier({ removeDebugger: true }),
  ],
  target: 'node',
};
