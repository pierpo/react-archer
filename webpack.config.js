const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebPackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const path = require('path')
const examplePath = path.resolve(__dirname, 'example')

module.exports = {
  entry: path.resolve(examplePath, 'index.js'),
  output: {
    path: examplePath,
    filename: 'bundle.js',
    library: 'reactArcher',
  },
  module: {
    loaders: [
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
      filename: 'index.html',
      alwaysWriteToDisk: true,
    }),
    new HtmlWebPackHarddiskPlugin({
      outputPath: './example'
    }),
  ],
  devServer: {
    contentBase: examplePath,
  },
};
