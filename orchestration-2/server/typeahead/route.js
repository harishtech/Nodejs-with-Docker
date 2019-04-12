const mapValues = require('lodash/mapValues');
const util = require('./util');
const connections = require('./connections');
const bodyBuilder = require('./bodyBuilder');
const constants = require('./constants');
const rabbit = require('./adapters/rabbit');

const logger = util.logger();

(async function connect() {
  await connections.connect();
})();

const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const callback = async (req, res) => {
  const id = util.uuid();
  const timeStarted = Date.now();
  logger.info({ requestId: id, timeStarted });

  const params = Object.keys(req.body);
  if (
    !params.includes('current_phase') ||
    !params.includes('date_of_birth') ||
    !params.includes('first_name') ||
    !params.includes('gender') ||
    !params.includes('group_number') ||
    !params.includes('latlng') ||
    !params.includes('last_name') ||
    !params.includes('member_id')
  ) {
    logger.info({
      requestId: id,
      msg: 'INVALID PARAMS',
      timeStarted,
      timeElapsed: Date.now() - timeStarted
    });
    return res.status(422).send({
      moreInformation:
        'Certain parameters are required and have not been supplied',
      httpMessage: 'Unprocessable Entity',
      httpCode: 422
    });
  }

  let response = { uuid: id, health_info: [], medications: [], find_care: [] };
  let totalServices = 0;
  let counter = 0;
  let consumerTag;

  const { processQueue, mqConnection } = connections.get();
  const ch = await mqConnection.createChannel();
  ch.prefetch(1);

  const timer = setTimeout(function() {
    consumerTag && ch.cancel(consumerTag);
    logger.info({
      requestId: id,
      msg: 'REQUEST TIMEOUT',
      timeStarted,
      timeElapsed: Date.now() - timeStarted
    });
    res.status(200).send(transformResponse(response));
  }, 1000);

  ch.consume(processQueue, async msg => {
    consumerTag = msg.fields.consumerTag;
    ch.ack(msg);

    const {
      nextResponse,
      isStartedMessage,
      isFinishedMessage
    } = await rabbit.handleMessage({
      message: JSON.parse(msg.content.toString()),
      response
    });

    response = nextResponse;

    if (isStartedMessage) {
      counter++;
      totalServices++;
      logger.info({
        requestId: id,
        msg: 'RABBIT STARTED MESSAGE RECEIVED',
        event: {
          type: 'RABBIT',
          meta: {
            fields: msg.fields,
            isStartedMessage,
            isFinishedMessage,
            counter,
            totalServices
          }
        },
        timeStarted,
        timeElapsed: Date.now() - timeStarted
      });
    } else if (isFinishedMessage) {
      counter--;
      logger.info({
        requestId: id,
        msg: 'RABBIT FINISHED MESSAGE RECEIVED',
        event: {
          type: 'RABBIT',
          meta: {
            fields: msg.fields,
            isStartedMessage,
            isFinishedMessage,
            counter,
            totalServices
          }
        },
        timeStarted,
        timeElapsed: Date.now() - timeStarted
      });
    }

    // is the request complete?
    if (rabbit.isComplete({ counter, totalServices })) {
      clearTimeout(timer);
      timer.unref();
      ch.cancel(consumerTag);
      logger.info({
        requestId: id,
        msg: 'REQUEST COMPLETE',
        timeStarted,
        timeElapsed: Date.now() - timeStarted
      });
      res.status(200).send(transformResponse(response));
    }
  });

  const requestBody = bodyBuilder(req.body, {
    id,
    processRoutingKey: processQueue
  });

  ch.publish(
    constants.topicName,
    constants.searchRoutingKey,
    Buffer.from(JSON.stringify(requestBody))
  );

  logger.info({
    requestId: id,
    msg: 'RABBIT MESSAGE PUBLISHED',
    event: {
      type: 'RABBIT',
      meta: {
        exchange: constants.topicName,
        routingKey: constants.searchRoutingKey
      }
    },
    timeStarted,
    timeElapsed: Date.now() - timeStarted
  });
};

function transformResponse(response) {
  return mapValues(response, (items, key) => {
    if (!items.map) return items;
    if (key === 'find_care') {
      return items.map(({ id, text, type, default_procedure }) =>
        Object.assign(
          {},
          {
            id,
            name: text,
            type,
            default_procedure
          }
        )
      );
    }

    return items.map(({ id, text, type }) =>
      Object.assign(
        {},
        {
          id,
          name: text,
          type
        }
      )
    );
  });
}

module.exports = asyncMiddleware(callback);
