const webpack = require('webpack');
const baseConfig = require('./webpack.config.base');

module.exports = {
  devtool: 'inline-source-map',

  entry: {
    ...baseConfig.entry,
    app: [
      'webpack-hot-middleware/client',
      './src/index.js',
    ],
  },

  output: {
    ...baseConfig.output,
    publicPath: '/',
  },

  module: {
    rules: [
      ...baseConfig.module.rules,
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')],
            },
          },
          'sass-loader',
        ],
      },
      {
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
      },
    ],
  },

  resolve: {
    ...baseConfig.resolve,
  },

  plugins: [
    ...baseConfig.plugins,
    new webpack.DefinePlugin({
      __DEVELOPMENT__: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
