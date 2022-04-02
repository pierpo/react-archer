module.exports = {
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  roots: ['src/'],
  setupFilesAfterEnv: ['./jest.setup.after.js'],
  setupFiles: ['./jest.setup.js'],
};
