const sanitize = (headers) => {
  delete headers.host;
  delete headers['content-type'];
  delete headers['content-length'];

  return headers;
};

const grabEieHeaders = (headers) => {
  let eieHeaders = {};

  Object.keys(headers).forEach(key => {
    if (key.toString().startsWith('eieheader')) {
      eieHeaders[key] = headers[key];
    }
  });

  return eieHeaders;
};

module.exports = { sanitize, grabEieHeaders };
