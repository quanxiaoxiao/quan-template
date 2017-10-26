/* eslint import/no-unresolved:0 */
/* eslint import/no-extraneous-dependencies:0 */
const webpack = require('webpack');
const baseConfig = require('./webpack.config.base');
const ExtractTextplugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    ...baseConfig.entry,
    app: './src/index.js',
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
        use: ExtractTextplugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]',
                minimize: true,
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
        }),
      },
      {
        test: /\.css$/,
        use: ExtractTextplugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'postcss-loader',
          ],
        }),
      },
    ],
  },

  plugins: [
    ...baseConfig.plugins,
    new webpack.DefinePlugin({
      __DEVELOPMENT__: false,
    }),
    new ExtractTextplugin({ filename: 'style.css', allChunks: true }),
    new webpack.optimize.UglifyJsPlugin(),
  ],
};
