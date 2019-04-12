const get = require('lodash.get');

const { asyncGetCache, setCache } = require('../utils/redis/utils');
const { getCircularReplacer } = require('../utils/json/getCircularReplacer');
const axiosWithLogging = require('../utils/axios/axiosWithLogging');
const headerCustodian = require('./headerCustodian');
const errorHandler = require('./errorHandler');

const url = process.env.APIC_ACCOUNTS_URL;

async function fetch({ accountId, headers, bearerToken, attempts = 0 }) {
  const maxAttempts = 1;
  let cachedResponse;

  try {
    cachedResponse = await asyncGetCache(accountId);
  } catch(e) {
    return e;
  }

  if (!cachedResponse) {
    try {
      let clientHeaders = headers;
      clientHeaders = Object.assign({'Authorization': `Bearer ${bearerToken}`}, clientHeaders);
      clientHeaders = headerCustodian.sanitize(clientHeaders);

      const response = await axiosWithLogging({
        method: 'get',
        url: url + `${accountId}`,
        data: null,
        headers: clientHeaders
      });

      setCache(accountId, JSON.stringify(response, getCircularReplacer()), 'EX', 3600);

      return response;
    } catch(e) {
      if ((get(e, 'response.data.httpCode') === '401') && (attempts < maxAttempts)) {
        return fetch({ accountId, headers, bearerToken, attempts: attempts += 1 });
      }

      return errorHandler.assessApicError(e);
    }
  } else {
    return JSON.parse(cachedResponse);
  }
}

module.exports = { fetch };
