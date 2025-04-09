// latencyjs/index.js
const winston = require("winston");
const colors = require('colors');


colors.setTheme({
    info: 'green',
    warn: 'yellow',
    error: 'red'
});

function createLogger(options = {}) {
    const {
        enabled = true,
        level = 'warn',
        logFile = 'slow-requests.log',
        format = winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message }) => {
                const coloredMessage = colors[level](message);
                return `[${timestamp}] [${level.toUpperCase()}] ${coloredMessage}`;
            })
        ),
        consoleEnabled = true  
    } = options;

    if (!enabled) {
        return {
            warn: () => {},
            info: () => {},
            error: () => {}
        };
    }

    const transports = [
        new winston.transports.File({ 
            filename: logFile,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
                })
            )
        })
    ];

    // Only add console transport if consoleEnabled is true
    if (consoleEnabled) {
        transports.push(new winston.transports.Console());
    }

    return winston.createLogger({
        level: level,
        format: format,
        transports: transports
    });
}

function latency(options = {}) {
    const {
        threshold = 100,
        logging = {
            level: 'warn',
            logFile: 'slow-requests.log',
            format: null,
            consoleEnabled: true
        },
        customThresholds = null
    } = options;

    const logger = createLogger(logging);

    return async function (req, res, next) {
        const start = process.hrtime();

        res.on("finish", () => {
            const duration = process.hrtime(start);
            const milliseconds = duration[0] * 1000 + duration[1] / 1000000;

            // Only use customThresholds if it's explicitly provided
            const methodThreshold = customThresholds ? (customThresholds[req.method] || threshold) : threshold;

            if (milliseconds > methodThreshold) {
                const logMessage = `Slow Request found => ${req.method}:${req.originalUrl} took: ${milliseconds.toFixed(2)} milliseconds (threshold: ${methodThreshold}ms)`;
                
                switch (logging.level) {
                    case 'info':
                        logger.info(logMessage);
                        break;
                    case 'warn':
                        logger.warn(logMessage);
                        break;
                    case 'error':
                        logger.error(logMessage);
                        break;
                    default:
                        logger.warn(logMessage);
                }
            }
        });

        next();
    };
}

module.exports = latency;