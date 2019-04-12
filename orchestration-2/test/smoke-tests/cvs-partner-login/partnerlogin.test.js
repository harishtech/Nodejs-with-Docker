/* eslint no-console: 0 */

require('dotenv').config();
const { expect } = require('chai');

const partnerlogin = require('./../../../server/cvs-partner-login/partnerLoginTokenData');

describe('CVS Partner Login Data', function() {
  describe('generate()', function() {
    if(typeof(process.env.CVS_API_KEY) === 'undefined' ||
      typeof(process.env.CVS_HOSTNAME) === 'undefined' ||
      typeof(process.env.CVS_CA_CRT_BASE64) === 'undefined' ||
      typeof(process.env.CVS_TLS_CRT_BASE64) === 'undefined' ||
      typeof(process.env.CVS_TLS_KEY_BASE64) === 'undefined' ) {

      console.log('In order to run this test, you need to have the following environment variables setup: CVS_API_KEY, CVS_HOSTNAME, CVS_CA_CRT, CVS_TLS_CRT, and CVS_TLS_KEY.');
      return false;
    }

    this.timeout(60000);

    it('returns an object that holds the partner login data', async () => {
      const headers = { host: 'localhost:8080',
        'user-agent': 'curl/7.61.0',
        accept: '*/*',
        eieheaderaction: 'READ',
        eieheaderorchestratingapplicationidentifier: '{"applicationIdentifier":{"idSource":108,"idValue":"451ca1b1-c90b-4e9e-96b5-f4a0d5bbd2b6","idType":"applications"}}',
        eieheaderversion: '{"eieHeaderVersion":{"major":2,"minor":0,"maintenance":0}}',
        eieheaderapplicationidentifier: '{"applicationIdentifier":{"idSource":108,"idValue":"451ca1b1-c90b-4e9e-96b5-f4a0d5bbd2b6","idType":"applications"}}',
        eieheaderusercontext: '{"eieHeaderUserContext":{"dnAccountName":"","assuranceLevel":"2","eieHeaderAuthorizedRole":[{"authorizedRole":"subscriber"}, {"authorizedRole":"memberSubscriber1"}],"accountIdentifier":{"idSource":"5","idValue":"QASP1-SUB-181687666","idType":"accounts"}}}',
        eieheadertransactionid: '95495635',
        'content-type': 'application/json; charset=utf-8',
        'content-length': '225' };

      const membershipId = '5~181687666+10+1+20080701+747771+A+1';

      const response = await partnerlogin.generate({ headers, membershipId });

      expect(response).to.have.property('tokenId');
      expect(response).to.have.property('apiKey');
      expect(response).to.have.property('apiSecret');
      expect(response.status).to.eq(200);
    });

  });
});
