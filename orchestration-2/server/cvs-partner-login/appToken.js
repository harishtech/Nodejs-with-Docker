const querystring = require('querystring');

const axiosWithLogging = require('../utils/axios/axiosWithLogging');

const url = process.env.APIC_OAUTH_URL;

async function fetch({ username = process.env.APIC_ID,
  password = process.env.APIC_SECRET } = {}) {
  const params = querystring.stringify({
    grant_type: 'client_credentials',
    scope: 'Public NonPII'
  });

  try {
    const response = await axiosWithLogging({
      method: 'post',
      url: url,
      data: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: { username, password }
    });

    return response;
  } catch(e) {
    return new Error(e);
  }
}

module.exports = { fetch };
