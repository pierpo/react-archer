const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebPackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const path = require('path')
const examplePath = path.resolve(__dirname, 'example')

const externals = {
  react: {
    root: 'React',
    commonjs2: 'react',
    commonjs: 'react',
    amd: 'react',
  },
  'react-dom': {
    root: 'ReactDOM',
    commonjs2: 'react-dom',
    commonjs: 'react-dom',
    amd: 'react-dom',
  },
  'prop-types': {
    root: 'PropTypes',
    commonjs2: 'prop-types',
    commonjs: 'prop-types',
    amd: 'prop-types',
  },
}

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
