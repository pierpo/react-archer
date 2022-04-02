module.exports = {
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  roots: ['src/'],
  setupFiles: ['./shim.js', './setup-tests.js'],
};
