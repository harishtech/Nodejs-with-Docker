const axios = require('axios');
const get = require('lodash.get');

const authorization = require('./authorization');
const { fetchEndpoint } = require('./routesManager');

const INVALID_TOKEN_FAULT_CODE = 900901;

async function execute(req, attempts = 0) {
  const maxAttempts = 1;
  const authToken = await authorization.getToken();
  const accessToken = authToken.access_token;

  try {
    return await axios({
      method: 'post',
      url: fetchEndpoint(req.path),
      data: req.body,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  } catch(e) {
    if ((get(e, 'response.data.fault.code') === INVALID_TOKEN_FAULT_CODE) && (attempts < maxAttempts)) {
      await authorization.forceRefreshToken();
      return execute(req, attempts += 1);
    }

    return e.response;
  }
}

module.exports = { execute };
