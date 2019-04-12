const { expect } = require('chai');

const partnerLoginTokenData = require('./../../../server/cvs-partner-login/partnerLoginTokenData');

const headers = {
  host: 'localhost:8080',
  'user-agent': 'curl/7.61.0',
  accept: '*/*',
  eieheaderaction: 'READ',
  eieheaderorchestratingapplicationidentifier: '{"applicationIdentifier":{"idSource":108,"idValue":"451ca1b1-c90b-4e9e-96b5-f4a0d5bbd2b6","idType":"applications"}}',
  eieheaderversion: '{"eieHeaderVersion":{"major":2,"minor":0,"maintenance":0}}',
  eieheaderapplicationidentifier: '{"applicationIdentifier":{"idSource":108,"idValue":"451ca1b1-c90b-4e9e-96b5-f4a0d5bbd2b6","idType":"applications"}}',
  eieheaderusercontext: '{"eieHeaderUserContext":{"dnAccountName":"","assuranceLevel":"2","eieHeaderAuthorizedRole":[{"authorizedRole":"subscriber"}, {"authorizedRole":"memberSubscriber1"}],"accountIdentifier":{"idSource":"5","idValue":"QASP1-SUB-181687666","idType":"accounts"}}}',
  eieheadertransactionid: '95495635',
  'content-type': 'application/json; charset=utf-8',
  'content-length': '225'
};
const membershipId = '5~181687666+10+1+20080701+747771+A+1';

describe('CVS Partner Login Token', function() {
  describe('partner login token data', function() {
    describe('generate()', function() {

      this.timeout(60000);

      it('returns an partner login token data', async () => {
        const loginTokenData = await partnerLoginTokenData.generate({ headers, membershipId });

        expect(loginTokenData.apiKey).to.equal(process.env.CVS_API_KEY);
        expect(loginTokenData.apiSecret).to.equal(process.env.CVS_API_SECRET);
        expect(loginTokenData).to.have.property('tokenId');
        expect(loginTokenData).to.have.property('memberInfo');
      });
    });
  });
});
