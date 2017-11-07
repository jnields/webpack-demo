import path from 'path';
import nodeExternals from 'webpack-node-externals';
import BabelMinifyWebpackPlugin from 'babel-minify-webpack-plugin';
import autoprefixer from 'autoprefixer';
import { config } from 'dotenv';

const { NODE_ENV } = config().parsed;

const postcss = {
  loader: 'postcss-loader',
  options: {
    plugins: () => [autoprefixer()],
  },
};
const prod = NODE_ENV === 'production';


export default {
  entry: './src/server',
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
        exclude: path.resolve('./node_modules'),
        use: [
          ...(prod ? [] : ['react-hot-loader']),
          'babel-loader?forceEnv=server',
        ],
      },
      {
        test: /\.jpg$/,
        use: 'file-loader',
      },
      {
        test: /\.(s[ca]|c)ss$/,
        include: path.resolve('./src'),
        use: prod
          ? [
            'css-loader/locals?modules&camelCase',
            postcss,
            'sass-loader',
          ]
          : ['null-loader'],
      },
    ],
  },
  plugins: prod
    ? [
      new BabelMinifyWebpackPlugin({
        removeConsole: true,
        removeDebugger: true,
      }),
    ]
    : [],
  target: 'node',
};
