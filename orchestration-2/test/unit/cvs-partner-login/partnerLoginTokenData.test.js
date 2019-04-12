const { expect } = require('chai');
const sinon = require('sinon');

const loginTokenData = require('./../../../server/cvs-partner-login/partnerLoginTokenData');
const apicAppToken = require('./../../../server/cvs-partner-login/appToken');
const apicAccounts = require('./../../../server/cvs-partner-login/accounts');
const apicMemberships = require('./../../../server/cvs-partner-login/memberships');
const accountsMembershipsValidator = require('./../../../server/cvs-partner-login/accountsMembershipsValidator');
const memberDataMunger = require('./../../../server/cvs-partner-login/memberDataMunger');
const cvsAuthorization = require('./../../../server/cvs-partner-login/authorization');

const appTokenResponse = {data: { token_type: 'bearer',
  access_token: 'AAEkN2Y4N2RhMDktMjRmMS00Mzk5LWFiYmQtZjhkM2RlMWQwNGEw-5T8YEyxvsx6-C8-AL6TIgxBOPGqnyU8L9DyY5CPeqHY5r3YVN4C8lqok1pDuULQiR9C1cPXdNnBTzNxN6vqzdNun4pcMIMcbOG-sdDWevR-Ri7x0Qk95hKHQUrRPkXV',
  expires_in: 3600,
  scope: 'Public NonPII' }};
const accountsResponse = require('./fixtures/validAccountResponse.json');
const expiredAccountsResponse = require('./fixtures/expiredAccountsResponse.json');
const membershipsResponse = require('./fixtures/validMembershipResponse.json');
const dataMungerResponse = '<partnerLoginRequest><member><firstName>CHRIS</firstName><lastName>MINK</lastName><gender>M</gender><dateOfBirth>1982-05-31</dateOfBirth></member><partner><clientCode>X7700</clientCode><externalId>260895696</externalId></partner></partnerLoginRequest>';
const tokenDataResponse = { data: '<response> <header> <statusCode>0000</statusCode> <statusDesc>SUCCESS</statusDesc> <refId>Id-3588c75b370e03a44aaf5785</refId> <tokenID>704B9768138A3CB887DBAE889A27D85D</tokenID> <deviceID>device12345</deviceID> </header> <detail> <memberInfo> <firstName>CHRIS</firstName> <lastName>MINK</lastName> <gender>M</gender> <dateOfBirth>1982-05-31</dateOfBirth> </memberInfo> </detail> </response>' };
const headers = {
  host: 'localhost:8080',
  'user-agent': 'curl/7.61.0',
  accept: '*/*',
  eieheaderaction: 'READ',
  eieheaderorchestratingapplicationidentifier: '{"applicationIdentifier":{"idSource":108,"idValue":"451ca1b1-c90b-4e9e-96b5-f4a0d5bbd2b6","idType":"applications"}}',
  eieheaderversion: '{"eieHeaderVersion":{"major":2,"minor":0,"maintenance":0}}',
  eieheaderapplicationidentifier: '{"applicationIdentifier":{"idSource":108,"idValue":"451ca1b1-c90b-4e9e-96b5-f4a0d5bbd2b6","idType":"applications"}}',
  eieheaderusercontext: '{"eieHeaderUserContext":{"dnAccountName":"","assuranceLevel":"2","eieHeaderAuthorizedRole":[{"authorizedRole":"subscriber"}, {"authorizedRole":"memberSubscriber1"}],"accountIdentifier":{"idSource":"60","idValue":"QA3.PARSUB.696","idType":"accounts"}}}',
  eieheadertransactionid: '95495635',
  'content-type': 'application/json; charset=utf-8',
  'content-length': '225'
};
const membershipId = '5~260895696+10+1+20080101+759367+A+1';

describe('CVS Partner Login Service', () => {
  describe('partner login token data', () => {

    beforeEach(function() {
      sinon.restore();
    });

    describe('generate()', () => {
      it('returns an object that contains the CVS partner login token', async () => {
        sinon.stub(apicAppToken, 'fetch').returns(appTokenResponse);
        sinon.stub(apicAccounts, 'fetch').returns(accountsResponse);
        sinon.stub(apicMemberships, 'fetch').returns(membershipsResponse);
        sinon.stub(accountsMembershipsValidator, 'execute').returns({ invalid: false });
        sinon.stub(memberDataMunger, 'collect').returns(dataMungerResponse);
        sinon.stub(cvsAuthorization, 'getToken').returns(tokenDataResponse);

        const response = await loginTokenData.generate({ headers, membershipId });

        expect(response.tokenId).to.equal('704B9768138A3CB887DBAE889A27D85D');
        expect(response).to.have.property('memberInfo');
        expect(response.status).to.equal(200);
      });

      it('fails to return an object that contains the CVS partner login token if a validation fails', async () => {
        sinon.stub(apicAppToken, 'fetch').returns(appTokenResponse);
        sinon.stub(apicAccounts, 'fetch').returns(expiredAccountsResponse);
        sinon.stub(apicMemberships, 'fetch').returns(membershipsResponse);
        sinon.stub(accountsMembershipsValidator, 'execute').returns({ invalid: true, error: { data: { status: 403, service: 'accounts', message: 'account termed' } } });
        sinon.stub(memberDataMunger, 'collect').returns(dataMungerResponse);
        sinon.stub(cvsAuthorization, 'getToken').returns(tokenDataResponse);

        const response = await loginTokenData.generate({ headers, membershipId });

        expect(response).to.have.property('validationError');
        expect(response.validationError.data.status).to.equal(403);
      });
    });
  });
});
