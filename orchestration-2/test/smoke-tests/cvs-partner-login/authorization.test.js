require('dotenv').config();
const { expect } = require('chai');
const xmlJs = require('xml-js');

const cvsPartnerLoginToken = require('./../../../server/cvs-partner-login/authorization');
const { redisClient } = require('./../../../server/utils/redis/utils');

describe('CVS Partner Login Token', function() {
  describe('getToken()', function() {
    if(typeof(process.env.CVS_API_KEY) === 'undefined' ||
      typeof(process.env.CVS_HOSTNAME) === 'undefined' ||
      typeof(process.env.CVS_CA_CRT_BASE64) === 'undefined' ||
      typeof(process.env.CVS_TLS_CRT_BASE64) === 'undefined' ||
      typeof(process.env.CVS_TLS_KEY_BASE64) === 'undefined' ) {

      console.log('In order to run this test, you need to have the following environment variables setup: CVS_API_KEY, CVS_HOSTNAME, CVS_CA_CRT, CVS_TLS_CRT, and CVS_TLS_KEY.');
      return false;
    }

    this.timeout(60000);

    it('returns a successful response that includes a CVS Partner Login token', async () => {
      const memberData = '<partnerLoginRequest><member><firstName>HORDON</firstName><lastName>HAREN</lastName><gender>M</gender><dateOfBirth>1970-11-11</dateOfBirth></member><partner><clientCode>BLNK</clientCode><externalId>SR964100101</externalId></partner></partnerLoginRequest>';
      const xmlResponse = await cvsPartnerLoginToken.getToken({ memberData });
      const jsonResponse = JSON.parse(xmlJs.xml2json(xmlResponse.data, { compact: true }));

      expect(jsonResponse.response.header.statusDesc._text).to.eq('SUCCESS');
      expect(jsonResponse.response.header.statusCode._text).to.eq('0000');
      expect(jsonResponse.response.header).to.have.property('tokenID');
    });

    describe('getToken() when setting/using cached responses', () => {
      beforeEach(() => {
        process.env.CACHE_ENABLED = true;
      });

      afterEach(() => {
        delete process.env.CACHE_ENABLED;
        redisClient.flushdb();
      });

      it('returns a successful response that includes a CVS Partner Login token', async () => {
        const memberData = '<partnerLoginRequest><member><firstName>HORDON</firstName><lastName>HAREN</lastName><gender>M</gender><dateOfBirth>1970-11-11</dateOfBirth></member><partner><clientCode>BLNK</clientCode><externalId>SR964100101</externalId></partner></partnerLoginRequest>';
        await cvsPartnerLoginToken.getToken({ memberData });

        const xmlResponse = await cvsPartnerLoginToken.getToken({ memberData });
        const jsonResponse = JSON.parse(xmlJs.xml2json(xmlResponse.data, { compact: true }));

        expect(jsonResponse.response.header.statusDesc._text).to.eq('SUCCESS');
        expect(jsonResponse.response.header.statusCode._text).to.eq('0000');
        expect(jsonResponse.response.header).to.have.property('tokenID');
      });
    });
  });
});

after(() => {
  redisClient.quit();
});
