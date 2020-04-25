const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const examplePath = path.resolve(__dirname, 'example');

module.exports = {
  mode: 'development',
  entry: path.resolve(examplePath, 'index.js'),
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: examplePath,
    filename: 'bundle.js',
    library: 'reactArcher',
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.(js|jsx)/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?sourceMap',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './example/index.template.ejs',
      inject: 'body',
    }),
  ],
  devServer: {
    contentBase: examplePath,
  },
};
