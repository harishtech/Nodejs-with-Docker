require('dotenv').config();
const { expect } = require('chai');
const appToken = require('./../../../server/cvs-partner-login/appToken');

describe('APIC App Token', function() {
  describe('fetch()', function() {
    if(typeof(process.env.APIC_ID) === 'undefined' || typeof(process.env.APIC_SECRET) === 'undefined') {
      console.log('You must add the APIC QAPATH ID and/or Secret to your test call.');
      return false;
    }

    this.timeout(5000);

    it('returns an app token', async () => {
      const token = await appToken.fetch();
      expect(token.data).to.have.property('access_token');
    });
  });
});
