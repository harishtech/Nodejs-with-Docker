require('dotenv').config();
const { expect } = require('chai');
const docAsapAuthToken = require('./../../../server/docAsap/authorization');

describe('DocASAP Bearer Token', function() {
  describe('getToken()', function() {
    if(typeof(process.env.DOCASAP_ID) === 'undefined' || typeof(process.env.DOCASAP_SECRET) === 'undefined') {
      console.log('You must add the DocASAP ID and/or Secret to your test call.');
      return false;
    }

    this.timeout(5000);

    it('returns an access token', async () => {
      const token = await docAsapAuthToken.getToken();
      expect(token).to.have.property('access_token');
    });
  });
});
