const fs = require('fs');
const path = require('path');

const LOG_DIR = process.env.LOG_DIR || './logs';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// Create logs directory if it doesn't exist
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const getCurrentLogLevel = () => LOG_LEVELS[LOG_LEVEL] || LOG_LEVELS.info;

const formatLog = (level, message, data = {}) => {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...data,
    env: process.env.NODE_ENV,
  });
};

const writeLog = (level, message, data = {}) => {
  if (LOG_LEVELS[level] > getCurrentLogLevel()) {
    return;
  }

  const logMessage = formatLog(level, message, data);
  const logFile = path.join(LOG_DIR, `${level}.log`);
  const allLogsFile = path.join(LOG_DIR, 'all.log');

  // Write to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.log(logMessage);
  }

  // Write to file
  fs.appendFileSync(logFile, logMessage + '\n');
  fs.appendFileSync(allLogsFile, logMessage + '\n');
};

const logger = {
  error: (message, data) => writeLog('error', message, data),
  warn: (message, data) => writeLog('warn', message, data),
  info: (message, data) => writeLog('info', message, data),
  debug: (message, data) => writeLog('debug', message, data),
};

module.exports = logger;
