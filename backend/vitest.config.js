const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.js'],
    env: {
      JWT_SECRET: 'test-secret-for-testing-only',
      USE_SQLITE: 'true'
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'json'],
      thresholds: {
        statements: 70,
        branches: 60,
        functions: 70,
        lines: 70
      }
    },
    testTimeout: 10000
  }
});
