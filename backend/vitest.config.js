const request = require('supertest');
const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.js', '**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    env: {
      JWT_SECRET: 'integration-test-secret-key-at-least-64-chars-long-for-security',
      JWT_REFRESH_SECRET: 'integration-test-refresh-secret-at-least-64-chars-long',
      USE_SQLITE: 'true',
      NODE_ENV: 'test',
      PORT: '0'
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
    testTimeout: 15000,
    hookTimeout: 15000
  }
});
