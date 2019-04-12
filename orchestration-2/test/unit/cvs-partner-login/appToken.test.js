const { expect } = require('chai');
const nock = require('nock');

const appToken = require('./../../../server/cvs-partner-login/appToken');

const apicPath = 'qapath1';

describe('CVS Partner Login Service APIC App Token', () => {
  describe('fetch()', () => {
    const username = 'mrspacman';
    const password = '1eatgh0$t$4breakfa$t';
    const mockAppTokenResponseData = 'AAEkZmQ4Njc2OTYtNmI4YS00NDY1LWE0NjAtZDZjZTNmYmFjODExMdOxJEaMIUb09OrVdR61HbCFLEBnB';

    beforeEach(() => {
      nock('https://qaapih1.int.aetna.com', {
        reqheaders: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json, text/plain, */*',
        }
      })
        .post(`/healthcare/${apicPath}/v5/auth/oauth2/token`, { grant_type: 'client_credentials', scope: 'Public NonPII' })
        .basicAuth({
          user: username,
          pass: password
        })
        .reply(200, mockAppTokenResponseData);
    });

    after(() => {
      nock.cleanAll();
    });

    it('returns an APIC app token', async () => {
      const apicAppToken = await appToken.fetch({ username, password });

      expect(apicAppToken.data).to.equal(mockAppTokenResponseData);
      expect(apicAppToken.status).to.equal(200);
    });
  });
});
