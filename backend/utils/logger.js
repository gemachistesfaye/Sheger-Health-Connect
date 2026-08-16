// Backward-compatible re-export for JS files that haven't been migrated yet.
// Once all consuming files are migrated to TypeScript, this file can be removed.
// Canonical source: ../utils/logger.ts

let logger;
try {
  const pino = require('pino');
  const isTest = process.env.NODE_ENV === 'test';
  const isProduction = process.env.NODE_ENV === 'production';
  logger = pino({
    level: isTest ? 'silent' : isProduction ? 'info' : 'debug',
  });
} catch {
  // Fallback when pino is unavailable
  const noop = () => {};
  const log = (msg) => console.log(typeof msg === 'string' ? msg : JSON.stringify(msg));
  logger = {
    info: log,
    error: log,
    warn: log,
    debug: noop,
    trace: noop,
    fatal: log,
    child: () => logger,
  };
}

module.exports = { logger };
