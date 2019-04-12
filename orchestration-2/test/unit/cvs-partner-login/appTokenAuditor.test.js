const { expect } = require('chai');
const sinon = require('sinon');

const appTokenAuditor = require('./../../../server/cvs-partner-login/appTokenAuditor');
const apicAppToken = require('./../../../server/cvs-partner-login/appToken');

const headersWithAuth = { authorization: 'Bearer AAEkN2Y4N2RhMDktMjRmMS00M',
  host: 'localhost:8080' };
const headersWithoutAuth = { host: 'localhost:8080' };

describe('appTokenAuditor', () => {
  describe('verify()', () => {
    it('returns the auth token if one exists in headers', async () => {
      const bearer = await appTokenAuditor.verify(headersWithAuth);
      expect(bearer).to.eq('AAEkN2Y4N2RhMDktMjRmMS00M');
    });

    it('returns the auth token if one does not exist in headers', async () => {
      this.apicAppToken = sinon.stub(apicAppToken, 'fetch').
        returns({ data: { access_token: 'AAEkN2Y4N2RhMDktMjRmMS00M' }});
      const bearer = await appTokenAuditor.verify(headersWithoutAuth);
      expect(bearer).to.eq('AAEkN2Y4N2RhMDktMjRmMS00M');
      apicAppToken.fetch.restore();
    });
  });
});
