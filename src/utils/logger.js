import winston from 'winston';
const { combine, timestamp, printf, colorize, align, json } = winston.format;
import 'winston-daily-rotate-file';

// const fileRotateTransport = new winston.transports.DailyRotateFile({
//   filename: 'combined-%DATE%.log',
//   datePattern: 'YYYY-MM-DD',
//   maxFiles: '14d',
// });

const errorFilter = winston.format((info, opts) => {
  return info.level === 'error' ? info : false;
});

const infoFilter = winston.format((info, opts) => {
  return info.level === 'info' ? info : false;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
//    defaultMeta: {
//     service: 'service-b',
//   },
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
  ),
  //   transports: [new winston.transports.Console()],
  transports: [
    new winston.transports.File({
      filename: 'combined.log',
    }),
    new winston.transports.File({
      filename: 'errors.log',
      level: 'error',
      format: combine(errorFilter(), timestamp(), json()),
    }),
    new winston.transports.File({
      filename: 'info.log',
      level: 'info',
      format: combine(infoFilter(), timestamp(), json()),
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'exception.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'rejections.log' }),
  ],
});

export default logger;
