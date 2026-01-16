/**
 * Logging utility using Pino.
 *
 * In development, logs are pretty-printed to the console.
 * In production, logs are JSON-formatted for log aggregators.
 */

import pino from 'pino';

const isDevelopment = process.env.NODE_ENV !== 'production';

const baseLogger = pino({
  level: isDevelopment ? 'debug' : 'info',
  ...(isDevelopment && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  }),
});

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  [key: string]: unknown;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
}

class Logger {
  private pino: pino.Logger;

  constructor(pinoInstance: pino.Logger = baseLogger) {
    this.pino = pinoInstance;
  }

  debug(message: string, context?: LogContext): void {
    this.pino.debug(context ?? {}, message);
  }

  info(message: string, context?: LogContext): void {
    this.pino.info(context ?? {}, message);
  }

  warn(message: string, context?: LogContext): void {
    this.pino.warn(context ?? {}, message);
  }

  error(message: string, context?: LogContext): void {
    this.pino.error(context ?? {}, message);
  }

  /**
   * Log an error with stack trace
   */
  exception(error: Error, context?: LogContext): void {
    this.pino.error({ err: error, ...context }, error.message);
  }

  /**
   * Create a child logger with preset context
   */
  child(defaultContext: LogContext): Logger {
    return new Logger(this.pino.child(defaultContext));
  }
}

// Export a singleton instance
export const logger = new Logger();
