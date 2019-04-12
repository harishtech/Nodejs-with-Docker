const get = require('lodash.get');

const wrap = ({ status, title, detail, payload }) => {
  return { error: true, data: { status, title, detail }, payload };
};

const assess = ({ customError = '', payload }) => {
  const convert = require('xml-js');

  if(customError.length != 0) {
    return wrap({ status: customError.status, title: customError.title, detail: customError.detail, payload });
  } else {
    const parsedPayload = JSON.parse(convert.xml2json(payload.data, {compact: true, spaces: 4}));
    const statusCode = parsedPayload.response.header.statusCode._text;
    const statusDesc = parsedPayload.response.header.statusDesc._text;

    if (statusCode === '0000') {
      return payload;
    } else if (statusCode === '1001') {
      return wrap({ status: 503, title: 'Service Unavailable', detail: 'CVS 1001 - Gateway Error - One or more Input Parameters to the service is missing or incorrect.', payload });
    } else if (statusCode === '1002') {
      return wrap({ status: 500, title: 'Internal Server Error', detail: 'CVS 1002 - Gateway Error - API Key and/or APISecret authentication failed.', payload });
    } else if (statusCode === '9999') {
      return wrap({ status: 503, title: 'Service Unavailable', detail: 'CVS 9999 - Unknown Error - Please contact the system administrator.', payload });
    } else if (statusCode === '1003') {
      return wrap({ status: 503, title: 'Service Unavailable', detail: 'CVS 1003 - Gateway Error - Failed to translate the input parameters into gateway.', payload });
    } else if (statusCode === '2003') {
      return wrap({ status: 503, title: 'Service Unavailable', detail: 'CVS 2003 - Service Error - One or more utility services failed. Please contact the administrator.', payload });
    } else if (statusCode === '2017') {
      return wrap({ status: 500, title: 'Internal Server Error', detail: 'CVS 2017 - Gateway Error - HMAC Authentication fail.', payload });
    } else if (statusCode === '2021') {
      return wrap({ status: 500, title: 'Internal Server Error', detail: 'CVS 2021 - Registration Details Does not match', payload });
    } else if (statusCode === '2001') {
      return wrap({ status: 503, title: 'Service Unavailable', detail: 'CVS 2001 - Service Error - One or more underlying services are down. Please contact the System administrator', payload });
    } else if (statusCode === '8002') {
      return wrap({ status: 500, title: 'Internal Server Error', detail: 'CVS 8002 - Member not found', payload });
    }

    return { error: true, data: { status: 500, title: 'Internal Server Error', detail: `CVS ${statusCode} - ${statusDesc}` }, payload };
  }
};

const assessApicError = (error) => {
  const apicHttpCode = get(error, 'response.data.httpCode');
  const apicHttpCodeConversions = {
    '401': { status: 503, title: 'Service Unavailable' },
    '404': { status: 500, title: 'Internal Server Error' },
    '405': { status: 500, title: 'Internal Server Error' },
    '406': { status: 500, title: 'Internal Server Error' },
    '429': { status: 429, title: 'Too Many Requests' },
    '500': { status: 503, title: 'Service Unavailable' },
    '503': { status: 503, title: 'Service Unavailable' },
    '555': { status: 500, title: 'Internal Server Error' }
  };

  if (Object.keys(apicHttpCodeConversions).includes(apicHttpCode)) {
    const convertedApicResponse = apicHttpCodeConversions[apicHttpCode];
    const customErrorResponse = {
      error: true,
      status: convertedApicResponse.status,
      data: {
        status: convertedApicResponse.status,
        title: convertedApicResponse.title,
        detail: error.response.data.moreInformation
      }
    };

    return customErrorResponse;
  } else {
    return error;
  }
};

module.exports = { assess, assessApicError };
