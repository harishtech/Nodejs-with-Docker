const get = require('lodash.get');
const pino = require('pino');
const { grabEieHeaders } = require('../cvs-partner-login/headerCustodian');

const logger = () => {
  switch (process.env.NODE_ENVIRONMENT) {
  case 'test':
    return pino({ level: 'silent' });
  default:
    return pino();
  }
};

const logRequest = (req, message = 'HTTP REQUEST') => {
  const logPayload = {
    method: req.method,
    url: req.url,
    body: req.data || req.body
  };

  if(process.env.NODE_ENVIRONMENT === 'production') {
    logPayload['eie_headers'] = grabEieHeaders(req.headers);
  } else {
    logPayload['headers'] = req.headers;
  }
  logger().info(logPayload, message);
};

const logError = (errors, message) => {
  logger().error(message);
  logger().error(errors);
};

const logResponse = (response, message = 'HTTP RESPONSE') => {
  const logPayload = {
    status: response.status,
    response_body: redactBody(response.data)
  };

  logger().info(logPayload, message);
};

const redactBody = (body) => {
  const membershipDetail = get(body, 'membershipResponse.membershipDetail');
  const redacted = '[REDACTED]';
  if (get(membershipDetail, 'person.tobaccoUse')) {
    body.membershipResponse.membershipDetail.person.tobaccoUse = redacted;
  }
  if (get(membershipDetail, 'medicareMembership')) {
    body.membershipResponse.membershipDetail.medicareMembership = redacted;
  }
  if (get(membershipDetail, 'medicareIdentifier')) {
    body.membershipResponse.membershipDetail.medicareIdentifier = redacted;
  }
  return body;
};

module.exports = {
  logger,
  logRequest,
  logError,
  logResponse,
  redactBody
};
