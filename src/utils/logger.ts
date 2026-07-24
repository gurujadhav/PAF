/**
 * PAF Framework Logger Utility
 */
export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  DEBUG = 'DEBUG',
}

export class Logger {
  private static formatTime(): string {
    return new Date().toISOString();
  }

  private static log(level: LogLevel, message: string, ...args: any[]): void {
    const timestamp = this.formatTime();
    let prefix = `[${timestamp}] [PAF::${level}]`;

    switch (level) {
      case LogLevel.INFO:
        console.log(`\x1b[36m${prefix}\x1b[0m`, message, ...args);
        break;
      case LogLevel.SUCCESS:
        console.log(`\x1b[32m${prefix}\x1b[0m`, message, ...args);
        break;
      case LogLevel.WARN:
        console.warn(`\x1b[33m${prefix}\x1b[0m`, message, ...args);
        break;
      case LogLevel.ERROR:
        console.error(`\x1b[31m${prefix}\x1b[0m`, message, ...args);
        break;
      case LogLevel.DEBUG:
        if (process.env.DEBUG) {
          console.log(`\x1b[35m${prefix}\x1b[0m`, message, ...args);
        }
        break;
    }
  }

  public static info(message: string, ...args: any[]): void {
    this.log(LogLevel.INFO, message, ...args);
  }

  public static success(message: string, ...args: any[]): void {
    this.log(LogLevel.SUCCESS, message, ...args);
  }

  public static warn(message: string, ...args: any[]): void {
    this.log(LogLevel.WARN, message, ...args);
  }

  public static error(message: string, ...args: any[]): void {
    this.log(LogLevel.ERROR, message, ...args);
  }

  public static debug(message: string, ...args: any[]): void {
    this.log(LogLevel.DEBUG, message, ...args);
  }
}
