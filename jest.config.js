module.exports = {
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  roots: ['src/'],
  setupFilesAfterEnv: ['./jest.setup.after.js'],
  setupFiles: ['./shim.js', './setup-tests.js'],
};
