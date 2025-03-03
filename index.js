// latencyjs/index.js
const winston = require("winston");
require('colors');
const logger = winston.createLogger({
    level: "warn", // Log only warnings and above
    format: winston.format.combine(
      winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
        const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`
        return formattedMessage.yellow;
      })
    ),
    transports: [
      new winston.transports.Console(), // Log to console
      new winston.transports.File({ filename: "slow-requests.log" }) // Log to a file
    ]
  });

function latency(threshold = 100) {
    return async function (req, res, next) {
      const start = process.hrtime();
  
      res.on("finish", () => {
        const duration = process.hrtime(start);
        const milliseconds = duration[0] * 1000 + duration[1] / 1000000;
  
        if (milliseconds > threshold) {
          logger.warn(
            `Slow Request found => ${req.method}:${req.originalUrl} took: ${milliseconds.toFixed(2)} milliseconds`
          );
        }
      });
  
      next();
    };
  }
  
  module.exports = latency;