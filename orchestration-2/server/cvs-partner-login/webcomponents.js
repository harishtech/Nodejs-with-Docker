async function mediate(req) {
  const partnerLoginTokenData = require('./partnerLoginTokenData');
  const componentizer = require('./componentizer');

  const headers = req.headers;
  const membershipId = req.body.cvsAuthRequest.membershipId.resourceId;
  let cvsTokenData;

  try {
    cvsTokenData = await partnerLoginTokenData.generate({ headers, membershipId });
    if ('error' in cvsTokenData) return cvsTokenData;

    const webComponent = componentizer.componentize({ cvsPartnerLoginToken: cvsTokenData.tokenId });
    return { data: { status: 200, message: { webComponent } } };
  } catch(e) {
    return e;
  }
}

module.exports = { mediate };
