import winston from 'winston';
const { combine, timestamp, printf, colorize, align, json } = winston.format;
import 'winston-daily-rotate-file';

// const fileRotateTransport = new winston.transports.DailyRotateFile({
//   filename: 'combined-%DATE%.log',
//   datePattern: 'YYYY-MM-DD',
//   maxFiles: '14d',
// });

// const errorFilter = winston.format((info, opts) => {
//   return info.level === 'error' ? info : false;
// });

// const infoFilter = winston.format((info, opts) => {
//   return info.level === 'info' ? info : false;
// });

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports: [
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
        json(),
      ),
    }),
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({
          format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/errors.log',
      level: 'error',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
        json(),
      ),
    }),
    new winston.transports.File({
      filename: 'info.log',
      level: 'info',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
        json(),
      ),
    }),
  ],

  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exception.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
});

export default logger;
