// src/utils/logger.ts

const LOG_PREFIX = '[WebSocket]';

export interface Logger {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: (...args: any[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn: (...args: any[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: (...args: any[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug: (...args: any[]) => void;
}

const createLogger = (): Logger => {
  const isDevelopment = import.meta.env.DEV;

  return {
    info: (...args) => {
      // eslint-disable-next-line no-console
      console.info(LOG_PREFIX, ...args);
    },
    warn: (...args) => {
      // eslint-disable-next-line no-console
      console.warn(LOG_PREFIX, ...args);
    },
    error: (...args) => {
      // eslint-disable-next-line no-console
      console.error(LOG_PREFIX, ...args);
    },
    debug: (...args) => {
      if (isDevelopment) {
        // eslint-disable-next-line no-console
        console.debug(LOG_PREFIX, ...args);
      }
    },
  };
};

export const logger = createLogger();
