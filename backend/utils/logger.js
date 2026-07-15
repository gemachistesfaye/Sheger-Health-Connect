let pino;
try {
  pino = require('pino');
} catch {
  pino = null;
}

const level = process.env.NODE_ENV === 'test' ? 'silent' : (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

let logger;
if (pino) {
  logger = pino({ level });
} else {
  const noop = () => {};
  const consoleLog = (msg) => console.log(typeof msg === 'string' ? msg : JSON.stringify(msg));
  logger = {
    info: level === 'silent' ? noop : consoleLog,
    error: level === 'silent' ? noop : (obj, msg) => console.error(msg || JSON.stringify(obj)),
    warn: level === 'silent' ? noop : consoleLog,
    debug: noop,
    trace: noop,
    fatal: consoleLog,
    child: () => logger
  };
}

module.exports = { logger };
