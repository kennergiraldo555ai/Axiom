import pino, { type LoggerOptions } from 'pino';

// Pino is configured for JSON logging in production and pretty logging in development.
const isDev = process.env.NODE_ENV !== 'production';

const options: LoggerOptions = {
  level: process.env.LOG_LEVEL || 'info',
  base: {
    env: process.env.NODE_ENV,
  },
};

if (isDev) {
  options.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname',
      translateTime: 'SYS:standard',
    },
  };
}

export const logger = pino(options);
