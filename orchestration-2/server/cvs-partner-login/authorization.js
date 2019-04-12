const https = require('https');
const convert = require('xml-js');

const { asyncGetCache, setCache } = require('../utils/redis/utils');
const { getCircularReplacer } = require('../utils/json/getCircularReplacer');
const axiosWithLogging = require('../utils/axios/axiosWithLogging');
const errorHandler = require('./errorHandler');
const hmacUtility = require('./hmacUtility');

async function getToken({ memberData,
  apiKey = process.env.CVS_API_KEY,
  hmacData = hmacUtility.execute({}),
  hostname = process.env.CVS_HOSTNAME }) {

  if ('error' in hmacData) return hmacData;

  let caCrt, tlsCrt, tlsKey, externalId, cachedResponse;

  try {
    externalId = JSON.parse(convert.xml2json(memberData, { compact: true })).partnerLoginRequest.partner.externalId._text;
    cachedResponse = await asyncGetCache(externalId);
  } catch(e) {
    return e;
  }

  if (!cachedResponse) {
    try {
      caCrt = process.env.CVS_CA_CRT || Buffer.from(process.env.CVS_CA_CRT_BASE64, 'base64').toString();
      tlsCrt = process.env.CVS_TLS_CRT || Buffer.from(process.env.CVS_TLS_CRT_BASE64, 'base64').toString();
      tlsKey = process.env.CVS_TLS_KEY || Buffer.from(process.env.CVS_TLS_KEY_BASE64, 'base64').toString();
    } catch(e) {
      const errorWrapper = errorHandler.assess({ customError:
        { status: 495,
          title: 'SSL Certificate Error',
          detail: 'There is likely an error with the CVS certificates for partnerLogin' }, payload: e
      });
      return errorWrapper;
    }

    try {
      let response = await axiosWithLogging({
        method: 'post',
        url: `https://${hostname}/login/partnerLogin`,
        params: {
          version: '2.0',
          serviceName: 'partnerLogin',
          appName: 'CMK_WEB',
          apiKey: apiKey,
          deviceType: 'DESKTOP',
          responseLevel: 0,
          hmac: hmacData.hmac,
          timestamp: hmacData.timestamp,
          deviceID: 'device12345',
          deviceToken: 'device12345'
        },
        data: memberData,
        headers: {
          'Content-Type': 'application/xml',
          'Accept': 'application/xml'
        },
        httpsAgent: new https.Agent({
          ca: caCrt,
          cert: tlsCrt,
          key: tlsKey
        })
      });

      response = errorHandler.assess({ payload: response });

      if (! response.hasOwnProperty('error')) {
        setCache(externalId, JSON.stringify(response, getCircularReplacer()), 'EX', 3600);
      }

      return response;
    } catch(e) {
      return e;
    }
  } else {
    return JSON.parse(cachedResponse);
  }
}

module.exports = { getToken };
