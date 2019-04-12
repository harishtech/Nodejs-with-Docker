require('dotenv').config();
const { expect } = require('chai');

const { redisClient } = require('./../../../server/utils/redis/utils');
const appToken = require('./../../../server/cvs-partner-login/appToken');
const memberships = require('./../../../server/cvs-partner-login/memberships');

describe('APIC Memberships', function() {
  this.timeout(5000);

  describe('fetch()', function() {
    if(typeof(process.env.APIC_ID) === 'undefined' || typeof(process.env.APIC_SECRET) === 'undefined') {
      console.log('You must add the APIC QAPATH 3 ID and/or Secret to your test call.');
      return false;
    }

    it('returns membership information', async () => {
      const bearer = await appToken.fetch();
      const bearerToken = bearer.data.access_token;
      const membershipId = '5~181687666+10+1+20080701+747771+A+1';
      const headers = { eieheaderaction: 'READ',
        eieheaderorchestratingapplicationidentifier: '{"applicationIdentifier":{"idSource":108,"idValue":"451ca1b1-c90b-4e9e-96b5-f4a0d5bbd2b6","idType":"applications"}}',
        eieheaderversion: '{"eieHeaderVersion":{"major":2,"minor":0,"maintenance":0}}',
        eieheaderapplicationidentifier: '{"applicationIdentifier":{"idSource":108,"idValue":"451ca1b1-c90b-4e9e-96b5-f4a0d5bbd2b6","idType":"applications"}}',
        eieheaderusercontext: '{"eieHeaderUserContext":{"dnAccountName":"","assuranceLevel":"2","eieHeaderAuthorizedRole":[{"authorizedRole":"subscriber"}, {"authorizedRole":"memberSubscriber1"}],"accountIdentifier":{"idSource":"5","idValue":"QASP1-SUB-181687666","idType":"accounts"}}}',
        eieheadertransactionid: '95495635',
        connection: 'close',
        'user-agent': 'Paw/3.1.7 (Macintosh; OS X/10.12.6) GCDHTTPRequest' };

      const response = await memberships.fetch({ membershipId, headers, bearerToken });
      expect(response.data).to.have.property('membershipResponse');
    });
  });

  describe('fetch() when setting/using cached responses', () => {
    beforeEach(() => {
      process.env.CACHE_ENABLED = true;
    });

    afterEach(() => {
      delete process.env.CACHE_ENABLED;
      redisClient.flushdb();
    });

    it('returns membership information', async () => {
      const bearer = await appToken.fetch();
      const bearerToken = bearer.data.access_token;
      const membershipId = '5~181687666+10+1+20080701+747771+A+1';
      const headers = { eieheaderaction: 'READ',
        eieheaderorchestratingapplicationidentifier: '{"applicationIdentifier":{"idSource":108,"idValue":"451ca1b1-c90b-4e9e-96b5-f4a0d5bbd2b6","idType":"applications"}}',
        eieheaderversion: '{"eieHeaderVersion":{"major":2,"minor":0,"maintenance":0}}',
        eieheaderapplicationidentifier: '{"applicationIdentifier":{"idSource":108,"idValue":"451ca1b1-c90b-4e9e-96b5-f4a0d5bbd2b6","idType":"applications"}}',
        eieheaderusercontext: '{"eieHeaderUserContext":{"dnAccountName":"","assuranceLevel":"2","eieHeaderAuthorizedRole":[{"authorizedRole":"subscriber"}, {"authorizedRole":"memberSubscriber1"}],"accountIdentifier":{"idSource":"5","idValue":"QASP1-SUB-181687666","idType":"accounts"}}}',
        eieheadertransactionid: '95495635',
        connection: 'close',
        'user-agent': 'Paw/3.1.7 (Macintosh; OS X/10.12.6) GCDHTTPRequest' };

      await memberships.fetch({ membershipId, headers, bearerToken });
      const response = await memberships.fetch({ membershipId, headers, bearerToken });

      expect(response.data).to.have.property('membershipResponse');
    });
  });
});

after(() => {
  redisClient.quit();
});
