async function generate({ headers, membershipId }) {
  const convert = require('xml-js');
  const parser  = require('fast-xml-parser');

  const apicAppToken = require('./appToken');
  const accountIdGenerator = require('./accountIdGenerator');
  const apicAccounts = require('./accounts');
  const apicMemberships = require('./memberships');
  const accountsMembershipsValidator = require('./accountsMembershipsValidator');
  const memberDataMunger = require('./memberDataMunger');
  const cvsAuthorization = require('./authorization');

  let accountId;
  let bearerToken;
  let accounts;
  let memberships;
  let cvsTokenData;

  try {
    accountId = accountIdGenerator.execute(headers);

    bearerToken = await apicAppToken.fetch();
    bearerToken = bearerToken.data.access_token;

    accounts = await apicAccounts.fetch({ accountId, headers, bearerToken });
    if ('error' in accounts) return accounts;

    memberships = await apicMemberships.fetch({ membershipId, headers, bearerToken });
    if ('error' in memberships) return memberships;

    const validationAudit = accountsMembershipsValidator.execute(accounts, memberships);
    if (validationAudit.invalid) return {validationError: validationAudit.error};

    const memberData = memberDataMunger.collect(memberships);

    cvsTokenData = await cvsAuthorization.getToken({ memberData });
    if ('error' in cvsTokenData) return cvsTokenData;

    const cvsTokenDataJson = JSON.parse(convert.xml2json(cvsTokenData.data, {compact: true, spaces: 4}));
    const convertedJson = parser.parse(cvsTokenData.data);

    if(cvsTokenDataJson.response.header.statusCode._text === '0000') {
      const cvsPartnerLoginToken = convertedJson.response.header.tokenID;
      const cvsPartnerLoginData = {
        apiKey: process.env.CVS_API_KEY,
        apiSecret: process.env.CVS_API_SECRET,
        tokenId: cvsPartnerLoginToken,
        status: 200,
        memberInfo: convertedJson.response.detail.memberInfo
      };

      return cvsPartnerLoginData;
    } else {
      const tokenError = { data: { status: 401, message: JSON.stringify(cvsTokenDataJson)} };
      return { validationError: tokenError };
    }
  } catch(e) {
    return e;
  }
}

module.exports = { generate };
