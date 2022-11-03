module.exports = {
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  roots: ['src/'],
  setupFilesAfterEnv: ['./jest.setup.after.js', 'jest-extended/all'],
  setupFiles: ['./jest.setup.js'],
};
