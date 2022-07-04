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
    globalObject: "typeof self !== 'undefined' ? self : this",
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.build.json',
              compilerOptions: {
                noEmit: false,
                declarationDir: './lib',
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  externals: {
    react: 'react',
    reactDOM: 'react-dom',
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
