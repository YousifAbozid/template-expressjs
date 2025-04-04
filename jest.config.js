export default {
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
  testMatch: ['**/tests/**/*.test.js'],
  testTimeout: 10000,
  maxWorkers: 1,
  setupFiles: ['./tests/setup.js'],
  // ES modules are automatically handled by "type": "module" in package.json
  transform: {}, // Don't transform ES modules
  moduleFileExtensions: ['js', 'json', 'node'],
  // Handle imports to .js files
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
