import BabelMinifyWebpackPlugin from 'babel-minify-webpack-plugin';
import OptimizeCssAssetsWebpackPlugin from 'optimize-css-assets-webpack-plugin';
import ExtractTextWebpackPlugin from 'extract-text-webpack-plugin';
import NameAllModulesPlugin from 'name-all-modules-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import { config } from 'dotenv';

const outputPath = path.resolve('./build/public');
const extractCss = new ExtractTextWebpackPlugin('[chunkhash].css', { allChunks: true });

const { PORT, DEV_PORT, NODE_ENV, MINIFY } = config().parsed;

const postcss = {
  loader: 'postcss-loader',
  options: {
    plugins: () => [autoprefixer()],
  },
};
const prod = NODE_ENV === 'production';
const filename = `[name]${prod ? '-[chunkhash]' : ''}.js`;
const publicPath = '/public/';

function getChunkName(chunk) {
  if (chunk.name) return chunk.name;
  throw new Error('cannot dynamically import an unnamed chunk');
}

export default {
  entry: {
    main: [
      'whatwg-fetch',
      './src/client',
    ],
    'core-1': [
      'whatwg-fetch',
      'react',
      'react-dom',
      'redux',
      'redux-thunk',
      'react-redux',
    ],
    'core-2': [
      'prop-types',
      'react-router',
      'react-helmet',
    ],
  },
  output: {
    path: outputPath,
    publicPath,
    filename,
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
        extractCss,
      ]
      : [
        new webpack.HotModuleReplacementPlugin(),
      ]
    ),
    ...((prod && MINIFY !== 'false')
      ? [
        new BabelMinifyWebpackPlugin({
          removeConsole: true,
          removeDebugger: true,
        }),
        new OptimizeCssAssetsWebpackPlugin(),
      ]
      : []
    ),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: path.resolve('./build/bundles.html'),
      openAnalyzer: false,
      logLevel: 'silent',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.NamedChunksPlugin(getChunkName),
    new NameAllModulesPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['core-2', 'core-1'],
      filename,
      minChunks: Infinity,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime',
      filename,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
      'module.hot': JSON.stringify(!prod),
    }),
  ],
  devServer: {
    hot: true,
    port: DEV_PORT,
    https: true,
    contentBase: outputPath,
    publicPath,
    proxy: {
      '**': {
        target: `http://localhost:${PORT}`,
        secure: false,
        bypass: req => (req.path.startsWith(publicPath) ? req.originalUrl : false),
      },
    },
  },
};
