import pino from 'pino';

const isTest = process.env.NODE_ENV === 'test';
const isProduction = process.env.NODE_ENV === 'production';

export const logger = pino({
  level: isTest ? 'silent' : isProduction ? 'info' : 'debug',
  transport: isTest
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: !isProduction,
          translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
          ignore: 'pid,hostname',
        },
      },
});

export default logger;
