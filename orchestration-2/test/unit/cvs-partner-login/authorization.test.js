const { expect } = require('chai');
const nock = require('nock');
const sinon = require('sinon');

const authorization = require('./../../../server/cvs-partner-login/authorization');
const hmacUtility = require('./../../../server/cvs-partner-login/hmacUtility');
const errorHandler = require('./../../../server/cvs-partner-login/errorHandler');

describe('CVS Partner Login Service', () => {

  describe('getToken()', () => {
    sinon.stub(hmacUtility, 'execute').returns({hmac: 'DPyhLLFCAnC/hPf3KDhL7Xa2K4/qe6hcCHar4IEOwq0=', timestamp: 'MTUzMzc1ODY4NTkwMA=='});
    const hmacData = hmacUtility.execute({});
    const externalId = 260895696;
    const memberData = `<partnerLoginRequest><member><firstName>CHRIS</firstName><lastName>MINK</lastName><gender>M</gender><dateOfBirth>1982-05-31</dateOfBirth></member><partner><clientCode>X7700</clientCode><externalId>${externalId}</externalId></partner></partnerLoginRequest>`;
    const errorHandlerResponse = '{ "data": "<response><header><statusCode>0000</statusCode><statusDesc>SUCCESS</statusDesc><refId>Id-52cedc5bb73354790c6c7261</refId><tokenID>4CE580405F773AB2B158DA5175AFC881</tokenID><deviceID>device12345</deviceID></header><detail><memberInfo><firstName>CHRIS</firstName><lastName>MINK</lastName><gender>M</gender><dateOfBirth>1982-05-31</dateOfBirth></memberInfo></detail></response>" }';
    sinon.stub(errorHandler, 'assess').returns(errorHandlerResponse);
    const hostname = 'sit2-2waysslservices.caremark.com';

    beforeEach(() => {
      nock(`https://${hostname}`, {
        reqheaders: {
          'Content-Type': 'application/xml',
          'Accept': 'application/xml',
        }
      })
        .post('/login/partnerLogin', memberData)
        .query({
          version: '2.0',
          serviceName: 'partnerLogin',
          appName: 'CMK_WEB',
          apiKey: process.env.CVS_API_KEY,
          deviceType: 'DESKTOP',
          responseLevel: 0,
          hmac: hmacData.hmac,
          timestamp: hmacData.timestamp,
          deviceID: 'device12345',
          deviceToken: 'device12345'
        })
        .reply(200, errorHandlerResponse);
    });

    after(() => {
      nock.cleanAll();
      sinon.restore();
    });

    it('returns a CVS Partner Login token', async () => {
      const cvsPartnerLoginToken = await authorization.getToken({ memberData, hmacData, hostname });

      expect(cvsPartnerLoginToken.data).to.equal(errorHandlerResponse.data);
    });
  });
});
