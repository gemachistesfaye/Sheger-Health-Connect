const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.js', '**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    env: {
      JWT_SECRET: 'test-secret-for-testing-only',
      JWT_REFRESH_SECRET: 'test-refresh-secret-for-testing-only',
      USE_SQLITE: 'true',
      NODE_ENV: 'test'
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'json', 'html'],
      include: ['middleware/**/*.js', 'controllers/**/*.js', 'services/**/*.js', 'utils/**/*.js'],
      thresholds: {
        statements: 75,
        branches: 65,
        functions: 75,
        lines: 75
      }
    },
    testTimeout: 10000,
    hookTimeout: 10000
  }
});
