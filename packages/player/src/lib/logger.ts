export interface PlayerLogger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

export interface ConsoleLoggerOptions {
  debug?: boolean;
  info?: boolean;
  warn?: boolean;
  error?: boolean;
}

const noop = () => undefined;

const defaultLogger: PlayerLogger = {
  debug: noop,
  info: noop,
  warn: (...args: unknown[]) => {
    if (typeof console !== 'undefined') {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    if (typeof console !== 'undefined') {
      console.error(...args);
    }
  },
};

let activeLogger: PlayerLogger = defaultLogger;

export const createConsoleLogger = (options: ConsoleLoggerOptions = {}): PlayerLogger => {
  const {
    debug = false,
    info = false,
    warn = true,
    error = true,
  } = options;

  return {
    debug: (...args: unknown[]) => {
      if (debug && typeof console !== 'undefined') {
        console.debug(...args);
      }
    },
    info: (...args: unknown[]) => {
      if (info && typeof console !== 'undefined') {
        console.info(...args);
      }
    },
    warn: (...args: unknown[]) => {
      if (warn && typeof console !== 'undefined') {
        console.warn(...args);
      }
    },
    error: (...args: unknown[]) => {
      if (error && typeof console !== 'undefined') {
        console.error(...args);
      }
    },
  };
};

export const setPlayerLogger = (logger: Partial<PlayerLogger> | null): void => {
  if (!logger) {
    activeLogger = defaultLogger;
    return;
  }

  activeLogger = {
    debug: logger.debug ?? defaultLogger.debug,
    info: logger.info ?? defaultLogger.info,
    warn: logger.warn ?? defaultLogger.warn,
    error: logger.error ?? defaultLogger.error,
  };
};

export const getPlayerLogger = (): PlayerLogger => activeLogger;
