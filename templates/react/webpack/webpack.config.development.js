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

module.exports = {
  devtool: 'inline-source-map',
  entry: entry({ app: ['webpack-hot-middleware/client', './src/index.js'] }),
  output: output(),

  module: {
    rules: [
      jsLoader(),
      sassLoader(['style-loader']),
      cssLoader(['style-loader']),
      urlLoader(),
    ],
  },

  resolve: resolve(),

  plugins: plugins([
    new webpack.DefinePlugin({
      __DEVELOPMENT__: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
  ]),
};
