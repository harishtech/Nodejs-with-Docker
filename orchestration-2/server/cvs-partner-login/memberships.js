const get = require('lodash.get');

const { asyncGetCache, setCache } = require('../utils/redis/utils');
const { getCircularReplacer } = require('../utils/json/getCircularReplacer');
const axiosWithLogging = require('../utils/axios/axiosWithLogging');
const headerCustodian = require('./headerCustodian');
const errorHandler = require('./errorHandler');

const url = process.env.APIC_MEMBERSHIPS_URL;

async function fetch({ membershipId, headers, bearerToken, attempts = 0 }) {
  const maxAttempts = 1;
  let cachedResponse;

  try {
    cachedResponse = await asyncGetCache(membershipId);
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
        url: url + `${membershipId}`,
        data: null,
        headers: clientHeaders
      });

      setCache(membershipId, JSON.stringify(response, getCircularReplacer()), 'EX', 3600);

      return response;
    } catch(e) {
      if ((get(e, 'response.data.httpCode') === '401') && (attempts < maxAttempts)) {
        return fetch({ membershipId, headers, bearerToken, attempts: attempts += 1 });
      }

      return errorHandler.assessApicError(e);
    }
  } else {
    return JSON.parse(cachedResponse);
  }
}

module.exports = { fetch };
