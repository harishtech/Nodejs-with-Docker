require('dotenv').config();
const { expect } = require('chai');
const nock = require('nock');

const proxy = require('./../../../server/docAsap/proxy');

describe('DocASAP Service', () => {
  describe('proxy()', () => {
    describe('when a request is made with an invalid token', () => {
      const req = {
        path: '/docasap/v1/Providers/v1/GetProviderStatus',
        body: {}
      };

      const invalidTokenResponse = {
        'scope': 'am_application_scope default',
        'token_type': 'Bearer',
        'expires_in': 0,
        'access_token': '000000z0-z00z-0z0z-z0zz-z00z000z00z0'
      };

      const invalidTokenErrorResponse = {
        fault: {
          'code': 900901,
          'message': 'Invalid Credentials',
          'description': 'Access failure for API: /Providers/v1, version: v1 status: (900901) - Invalid Credentials. Make sure you have given the correct access token'
        }};

      const validTokenResponse = {
        'scope': 'am_application_scope default',
        'token_type': 'Bearer',
        'expires_in': 300000,
        'access_token': '859232d7-b37d-3d6a-a6df-c59c079e37d6'

      };

      const getProviderStatuResponse = {
        'status': true
      };

      beforeEach(() => {
        nock(process.env.DOCASAP_URL)
          .post('/token')
          .reply(200, invalidTokenResponse);

        nock(process.env.DOCASAP_URL, {
          reqheaders: {
            'authorization': `Bearer ${invalidTokenResponse.access_token}`
          }})
          .post('/Providers/v1/GetProviderStatus', req.body)
          .reply(401, invalidTokenErrorResponse);

        nock(process.env.DOCASAP_URL)
          .post('/token')
          .reply(200, validTokenResponse);

        nock(process.env.DOCASAP_URL, {
          reqheaders: {
            'authorization': `Bearer ${validTokenResponse.access_token}`
          }})
          .post('/Providers/v1/GetProviderStatus', req.body)
          .reply(200, getProviderStatuResponse);
      });

      after(() => {
        nock.cleanAll();
      });

      it('refreshes the token and makes the same request again', async () => {
        await proxy.execute(req);

        expect(nock.isDone()).to.be.true;
        expect(nock.pendingMocks().length).to.eq(0);
      });
    });
  });
});
