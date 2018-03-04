exports.root = true;

exports.plugins = ['prettier'];

exports.extends = ['standard', 'standard-react', 'prettier'];

exports.parser = 'babel-eslint';

exports.env = {
  browser: true,
};

exports.settings = {
  react: {
    version: '16.2',
  },
};

exports.globals = {};

exports.rules = {
  'prettier/prettier': [
    'error', null, { usePrettierRc: true }
  ],
};
