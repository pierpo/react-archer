const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const examplePath = path.resolve(__dirname, 'example');
const exampleDist = path.resolve(__dirname, 'example-dist');

module.exports = {
  mode: 'production',
  entry: path.resolve(examplePath, 'index.js'),
  output: {
    path: exampleDist,
    filename: 'example.js',
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
    new HtmlWebpackPlugin({
      template: './example/index.template.ejs',
      inject: 'body',
    }),
  ],
};
