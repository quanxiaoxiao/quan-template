const ExtractTextplugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const {
  entry,
  output,
  urlLoader,
  jsLoader,
  cssLoader,
  sassLoader,
  plugins,
  resolve,
} = require('./webpack.config.js');

const sass = sassLoader();
const css = cssLoader();

sass.use = ExtractTextplugin.extract({
  fallback: 'style-loader',
  use: sass.use,
});

css.use = ExtractTextplugin.extract({
  fallback: 'style-loader',
  use: css.use,
});

module.exports = {
  entry: entry(),
  output: output(),

  module: {
    rules: [
      jsLoader(),
      sass,
      css,
      urlLoader(),
    ],
  },

  resolve: resolve(),

  plugins: plugins([
    new webpack.DefinePlugin({
      __DEVELOPMENT__: false,
    }),
    new ExtractTextplugin({ filename: 'style.css', allChunks: true }),
    new webpack.optimize.UglifyJsPlugin(),
  ]),
};
