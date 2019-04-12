const errorHandler = require('./errorHandler');
const crypto = require('crypto');

function encodedHmac({ timestamp }) {
  const hmac = crypto.createHmac('sha256', process.env.CVS_API_SECRET);
  hmac.update(process.env.CVS_API_KEY + timestamp);

  return hmac.digest('base64');
}

function encodedTimestamp({ timestamp }) {
  return Buffer.from(timestamp).toString('base64');
}

function execute({ timestamp = Date.now().toString() }) {
  try {
    const base64Timestamp = encodedTimestamp({ timestamp });
    const hmac = encodedHmac({ timestamp });

    return { hmac, timestamp: base64Timestamp };
  } catch(e) {
    const errorWrapper = errorHandler.assess({ custom:
                                             { status: 495,
                                               title: 'SSL Certificate Error',
                                               detail: 'There is likely an error with the CVS keys pairs for HMAC encoding' }, errors: e
    });
    return errorWrapper;
  }
}

module.exports = { execute };
