import webpack from 'webpack';
import merge from 'lodash/object/merge';

const DEBUG = !process.argv.includes('--release');
const WATCH = process.argv.includes('--watch');
const VERBOSE = process.argv.includes('--verbose');

// Common configuration chunk to be used for all bundles

const config = {
  output: {
    publicPath: '/',
    sourcePrefix: '  ',
  },

  cache: DEBUG,
  debug: DEBUG,

  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE,
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`,
      'process.env.ENDPOINT': JSON.stringify(process.env.ENDPOINT),
      'process.env.PORT': JSON.stringify(process.env.PORT),
      __DEV__: 'false',
    }),
  ],

  resolve: {
    extensions: ['', '.js', '.jsx'],
  },

  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel' },
      { test: /\.json$/, loaders: ['json'] },
      { test: /\.styl$/, loaders: ['style/useable', 'css', 'stylus'] },
    ],
  },
};

// Configuration for the client-side bundle

const clientConfig = merge({}, config, {
  entry: [
    ...(WATCH ? ['webpack-hot-middleware/client'] : []),
    './src/app/index.js',
  ],

  output: {
    path: `${__dirname}/build/`,
    filename: 'bundle.js',
  },

  devtool: DEBUG ? 'cheap-module-eval-source-map' : false,

  plugins: [
    ...config.plugins,
    ...(!DEBUG ? [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({ compress: { warnings: VERBOSE } }),
      new webpack.optimize.AggressiveMergingPlugin(),
    ] : []),
    ...(WATCH ? [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
    ] : []),
  ],
});

// Configuration for the worker bundle

export default [clientConfig];
