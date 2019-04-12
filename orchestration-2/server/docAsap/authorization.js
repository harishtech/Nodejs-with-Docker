let currentAccessToken = {
  'expires_at': '1999-12-31',
};

const credentials = {
  'client': {
    'id': process.env.DOCASAP_ID,
    'secret': process.env.DOCASAP_SECRET
  },
  'auth': {
    'tokenHost': process.env.DOCASAP_URL,
    'tokenPath': '/token'
  },
  'options': {
    'useBodyAuth': false
  }
};

const oauth2 = require('simple-oauth2').create(credentials);

async function getToken(accessToken = currentAccessToken) {
  let oauth2AccessToken = oauth2.accessToken.create(accessToken);

  if (oauth2AccessToken.expired()) {
    try {
      const refreshedAccessToken = await oauth2.clientCredentials.getToken();
      currentAccessToken = refreshedAccessToken;
    } catch(e) {
      throw new Error(e);
    }
  } else {
    currentAccessToken = accessToken;
  }

  return currentAccessToken;
}

async function forceRefreshToken() {
  return await getToken({ 'expires_at': '1999-12-31' });
}

module.exports = { getToken, forceRefreshToken };
