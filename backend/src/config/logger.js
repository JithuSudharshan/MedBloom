import winston from 'winston';
import { ENV } from './env.js';

const logger = winston.createLogger({
    level: ENV.NODE_ENV === 'production' ? 'warn' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        ENV.NODE_ENV === 'production'
            ? winston.format.json()
            : winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message, ...meta }) => {
                    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
                    return `[${timestamp}] ${level}: ${message}${metaStr}`;
                })
            )
    ),
    transports: [
        new winston.transports.Console()
    ]
});

export default logger;
