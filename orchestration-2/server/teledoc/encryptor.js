const crypto = require('crypto');

const encrypt = ({ payload }) => {
  const publicKey = process.env.TELEDOC_RSA_KEY;
  const buffer = new Buffer(JSON.stringify(payload));
  const result = crypto.publicEncrypt({key: publicKey, padding: crypto.constants.RSA_PKCS1_PADDING}, buffer);

  return result.toString('base64');
};

module.exports = { encrypt };
