require('dotenv').config();
const { expect } = require('chai');
const nock = require('nock');

const authorization = require('./../../../server/docAsap/authorization');

describe('DocASAP Service', () => {
  describe('getToken()', () => {
    describe('when a non-expired access token already exists', () => {
      const existingAccessTokenExpiresAt = new Date('2050-01-01 12:00');
      const existingAccessToken = {
        'scope': 'am_application_scope default',
        'token_type': 'Bearer',
        'expires_in': 3,
        'access_token': '859232d7-b37d-3d6a-a6df-c59c079e37d6',
        'expires_at': existingAccessTokenExpiresAt
      };

      it('returns the exisitng access token', async () => {
        const accessToken = await authorization.getToken(existingAccessToken);

        expect(accessToken).to.have.property('expires_at', existingAccessTokenExpiresAt);
      });
    });

    describe('when an expired access token exists', () => {
      const expiredAccessToken = {
        'expires_at': '2000-01-01'
      };
      const newAccessTokenExpiresAt = new Date('2050-01-01 12:00');
      const newAccessToken = {
        'scope': 'am_application_scope default',
        'token_type': 'Bearer',
        'expires_in': 3,
        'access_token': '859232d7-b37d-3d6a-a6df-c59c079e37d6',
        'expires_at': newAccessTokenExpiresAt
      };

      beforeEach(() => {
        nock(process.env.DOCASAP_URL)
          .post('/token')
          .reply(200, newAccessToken);
      });

      after(() => {
        nock.cleanAll();
      });

      it('returns a new access token', async () => {
        const accessToken = await authorization.getToken(expiredAccessToken);

        expect(new Date(accessToken.expires_at).toDateString()).to.equal(newAccessTokenExpiresAt.toDateString());
      });
    });

    describe('when an access token is not provided as an argument', () => {
      const tokenResponse = {
        'scope': 'am_application_scope default',
        'token_type': 'Bearer',
        'expires_in': 3,
        'access_token': '859232d7-b37d-3d6a-a6df-c59c079e37d6',
        'expires_at': '2050-01-01 12:00'
      };

      beforeEach(() => {
        nock(process.env.DOCASAP_URL)
          .post('/token')
          .reply(200, tokenResponse);
      });

      after(() => {
        nock.cleanAll();
      });

      it('returns an active access token', async () => {
        const accessToken = await authorization.getToken();

        expect(new Date(accessToken.expires_at).toDateString()).to.equal(new Date(tokenResponse.expires_at).toDateString());
      });
    });
  });

  describe('forceRefreshToken()', () => {
    const mockAccessToken = {
      'scope': 'am_application_scope default',
      'token_type': 'Bearer',
      'expires_in': 3,
      'access_token': '6a9al3d7-bf7d-3d5a-a6di-p96x080e37e6',
      'expires_at': new Date('2000-10-31 12:00')
    };

    beforeEach(() => {
      nock(process.env.DOCASAP_URL)
        .post('/token')
        .reply(200, mockAccessToken);
    });

    after(() => {
      nock.cleanAll();
    });

    it('makes a call to get a new access token and returns it', async () => {
      const accessToken = await authorization.forceRefreshToken();

      expect(accessToken.access_token).to.equal(mockAccessToken.access_token);
    });
  });
});
