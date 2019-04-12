const pino = require('pino');
const uuidv4 = require('uuidv4');

const uuid = () => uuidv4();

const logger = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return prettyLogger();
    case 'test':
      return silentLogger();
    default:
      return defaultLogger();
  }
};

const defaultLogger = () => pino();

const prettyLogger = () =>
  pino({
    prettyPrint: { levelFirst: true },
    prettifier: require('pino-pretty')
  });

const silentLogger = () => {
  return pino({ level: 'silent' });
};

module.exports = {
  logger,
  uuid
};
