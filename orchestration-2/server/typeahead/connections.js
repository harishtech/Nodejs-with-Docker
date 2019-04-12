const amqp = require('amqplib');
const uuidv4 = require('uuid');
const constants = require('./constants');
const util = require('./util');
const logger = util.logger();

let mqConnection;
const processQueue = `typeahead_process_${uuidv4()}`;
const stackNamespace = process.env.STACK_NAMESPACE ? `/${process.env.STACK_NAMESPACE}` : '';
const rabbitUrl = `${process.env.RABBIT_PROTOCOL}://${process.env.RABBIT_USERNAME}:${process.env.RABBIT_PASSWORD}@${process.env.RABBIT_HOSTNAME}${stackNamespace}?heartbeat=15`;

async function taxonomyConnections() {
  logger.info('connecting to:', rabbitUrl);

  try {
    mqConnection = await amqp.connect(rabbitUrl);
  } catch (e) {
    logger.error('rabbit connection failed.');
    logger.error(e);
    throw new Error(e);
  }
  const ch = await mqConnection.createChannel();
  logger.info('channel made');

  ch.assertExchange(constants.topicName, 'topic', { durable: true });

  const q = await ch.assertQueue(processQueue, { exclusive: true });

  ch.bindQueue(q.queue, constants.topicName, processQueue);

  logger.info('queue made');

  return get();
}

function get() {
  return {
    mqConnection,
    processQueue
  };
}

module.exports = { connect: taxonomyConnections, get };
