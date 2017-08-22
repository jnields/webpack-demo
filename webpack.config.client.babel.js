import path from 'path';
import Minifier from 'babili-webpack-plugin';
import webpack from 'webpack';
import HtmlPlugin from 'html-webpack-plugin';

export default {
  entry: ['babel-polyfill', './src/client'],
  output: {
    path: path.resolve('./public'),
    filename: '[name].[hash].js',
    publicPath: '/static/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve('./src'),
        exclude: path.resolve('./node_modules'),
        use: 'babel-loader',
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
    new Minifier({
      removeConsole: true,
      removeDebugger: true,
    }),
    new HtmlPlugin(),
  ],
};
