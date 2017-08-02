const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ExtractTextplugin = require('extract-text-webpack-plugin');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

const APP_ENTRY = './src/index.js';
const webpackConfig = {
  devtool: isProd ? '' : 'source-map',
  entry: {
    app: isProd ?
      [APP_ENTRY] :
      [APP_ENTRY].concat('webpack-hot-middleware/client'),
    shim: ['babel-polyfill'],
    react: [
      'react',
      'react-dom',
      'react-redux',
      'redux',
      'redux-thunk',
    ],
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: isProd ? '/' : '/',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 40000,
            },
          },
        ],
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9])?$/,
        use: 'url-loader',
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['react', 'shim'],
    }),
    new webpack.DefinePlugin({
      __DEVELOPMENT__: !isProd,
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        PROXY_PREFIX: isProd ? false : JSON.stringify(''),
      },
    }),
  ],

};

const SASS_BASE = [
  {
    loader: 'css-loader',
    options: { modules: true, localIdentName: '[name]__[local]--[hash:base64:5]', minimize: true },
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: () => [require('autoprefixer')],
    },
  },
  'sass-loader',
];

if (isProd) {
  webpackConfig.module.rules.push({
    test: /\.scss$/,
    use: ExtractTextplugin.extract({
      fallback: 'style-loader',
      use: SASS_BASE,
    }),
  });

  webpackConfig.module.rules.push({
    test: /\.css$/,
    use: ExtractTextplugin.extract({
      fallback: 'style-loader',
      use: [
        { loader: 'css-loader', options: { minimize: true } },
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => [require('autoprefixer')],
          },
        },
      ],
    }),
  });

  webpackConfig.plugins.push(
    new ExtractTextplugin({ filename: 'style.css', allChunks: true }),
    new webpack.optimize.UglifyJsPlugin() // eslint-disable-line
  );
} else {
  webpackConfig.module.rules.push({
    test: /\.scss$/,
    use: [
      'style-loader',
      ...SASS_BASE,
    ],
  });
  webpackConfig.module.rules.push({
    test: /\.css$/,
    use: [
      'style-loader',
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          plugins: () => [require('autoprefixer')],
        },
      },
    ],
  });
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = webpackConfig;
