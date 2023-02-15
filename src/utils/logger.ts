import { createLogger, format, transports } from 'winston';
const { combine, timestamp, json, errors } = format;

const modifyInfo = format(info => info);
const logFormat = combine(timestamp(), modifyInfo(), json(), errors({ stack: true }));

export default createLogger({
  level: 'error',
  transports: [
    new transports.File({
      format: logFormat,
      filename: 'logs/server.log',
    }),
    new transports.Stream({ format: logFormat, stream: process.stdout }),
  ],
  defaultMeta: { service: 'my_app' },
});
