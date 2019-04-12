const apicAppToken = require('./appToken');

async function verify(headers) {
  let bearer;

  if(headers.hasOwnProperty('authorization')) {
    bearer = headers.authorization.split(' ')[1];
  } else {
    bearer = await apicAppToken.fetch();
    bearer = bearer.data.access_token;
  }

  return bearer;
}

module.exports = { verify };
