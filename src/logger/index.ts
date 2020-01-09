import { basename, dirname } from 'path';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

declare global {
  type Logger = {
    [i in 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly']: typeof console.log;
  };

  namespace NodeJS {
    interface Global {
      logger: Logger;
    }
  }

  const logger: NodeJS.Global['logger'];
}

const consoleTransport = new transports.Console({
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(info => `${info.timestamp} [${info.level}] ${info.message}`),
  ),
});
export const logger = createLogger({
  level: 'debug',
  transports: [consoleTransport],
});

export function setApp(app: string) {
  consoleTransport.format = format.combine(
    format.colorize(),
    format.timestamp(),
    format((info, opts) => {
      info.app = opts.app;
      return info;
    })({ app }),
    format.printf(info => `${info.timestamp} [${info.app}] [${info.level}] ${info.message}`),
  );
}

export function toFile(path: string) {
  logger.add(new DailyRotateFile({
    dirname: dirname(path),
    filename: `${basename(path)}.%DATE%`,
  }));
}

// export to global scope
global.logger = logger;
