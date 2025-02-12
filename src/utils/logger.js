import winston from 'winston';

const createLogger = (agentName) => {
  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    defaultMeta: { agent: agentName },
    transports: [
      new winston.transports.File({ filename: `logs/${agentName}-error.log`, level: 'error' }),
      new winston.transports.File({ filename: `logs/${agentName}-combined.log` }),
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    ]
  });
};

export default createLogger;
