exports.root = true;

exports.plugins = ['prettier', 'react'];

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

exports.globals = {'expect': true, 'it': true, 'describe': true};

exports.rules = {
  'prettier/prettier': [
    'error', null, { usePrettierRc: true }
  ],
};
