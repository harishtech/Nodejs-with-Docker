const { logger, logRequest } = require('./../logger.js');
const expressLogger = (req, res, next) => {
  if(shouldLog(req.url)) {
    logRequest(req, 'REQ::EXPRESS MIDDLEWARE');

    let logPayload = {
      status: res.statusCode,
      // response_body: body
    };

    logger().info(logPayload, 'RES::EXPRESS MIDDLEWARE');
  }

  next();
};

const shouldLog = (requestUrl) => {
  if(requestUrl.includes('apic')) {
    return true;
  } else if (requestUrl.includes('cvs')) {
    return true;
  } else {
    return false;
  }
};

const errorLogger = (err, req, res, next) => {
  logger().error(err);

  next();
};

module.exports = {
  expressLogger,
  errorLogger,
  shouldLog
};
