/* eslint import/no-unresolved:0 */
/* eslint import/no-extraneous-dependencies:0 */
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
  entry: {
    shim: ['babel-polyfill'],
    react: [
      'react',
      'react-dom',
      'redux',
      'redux-thunk',
    ],
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
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

  resolve: {
    modules: [
      path.join(__dirname, 'src'),
      'node_modules',
    ],
  },

  plugins: [
    new LodashModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['react', 'shim'],
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ],
};
