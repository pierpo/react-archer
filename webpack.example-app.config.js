const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const examplePath = path.resolve(__dirname, 'example');
const exampleDist = path.resolve(__dirname, 'example-dist');

const prodConfig = require('./webpack.prod.config');

prodConfig.entry = path.resolve(examplePath, 'index.tsx');

prodConfig.output = {
  path: exampleDist,
  filename: 'example.js',
};

prodConfig.module.rules.push({
  test: /\.css$/,
  loader: 'style-loader!css-loader?sourceMap',
});

prodConfig.plugins = prodConfig.plugins || [];
prodConfig.plugins.push(
  new HtmlWebpackPlugin({
    template: './example/index.template.ejs',
    inject: 'body',
  }),
);

prodConfig.externals = [];

module.exports = prodConfig;
