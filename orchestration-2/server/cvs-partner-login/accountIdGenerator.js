const execute = (headers) => {
  try {
    const parsedHeaders = JSON.parse(headers.eieheaderusercontext);
    const idSource = parsedHeaders.eieHeaderUserContext.accountIdentifier.idSource;
    const idValue = parsedHeaders.eieHeaderUserContext.accountIdentifier.idValue;
    const accountId = `${idSource}~${idValue}`;

    return accountId;
  } catch(e) {
    throw new Error({status: 401, data: { message: 'No account ID found in EIE headers', error: e } });
  }
};

module.exports = { execute };
