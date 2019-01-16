var path = require('path');
var webpack = require('webpack');

// TODO lots of cleanup to do here
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
};

var config = {
  mode: 'production',
  entry: './src/react-archer.js',
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
        test: /\.(js|jsx)/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  externals: externals,
};

module.exports = config;
