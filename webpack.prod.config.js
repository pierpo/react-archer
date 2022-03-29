const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

var config = {
  mode: 'production',
  entry: './src/react-archer.ts',
  output: {
    path: path.join(__dirname, 'lib'),
    publicPath: 'lib/',
    filename: 'react-archer.js',
    sourceMapFilename: 'react-archer.sourcemap.js',
    library: 'ReactArcher',
    libraryTarget: 'umd',
    globalObject: 'typeof self !== \'undefined\' ? self : this',
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.(js|jsx|ts|tsx)/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        terserOptions: {
          compress: {
            inline: false,
          },
        },
      }),
    ],
  },
};

module.exports = config;
