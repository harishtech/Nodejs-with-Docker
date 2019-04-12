const { expect } = require('chai');

const accountsMembershipsValidator = require('./../../../server/cvs-partner-login/accountsMembershipsValidator');

const validAccountsResponse = require('./fixtures/validAccountResponse.json');
const validMembershipsResponse = require('./fixtures/validMembershipResponse.json');
const apic555Response = { 'response': { 'status': 555 } };
const emptyResponse = {};
const emptyAccountsResourceId = require('./fixtures/emptyAccountsResourceId.json');
const termedAccountsResponse = require('./fixtures/termedAccountsResponse.json');
const expiredAccountsResponse = require('./fixtures/expiredAccountsResponse.json');
const terminatedStatusAccountsResponse = require('./fixtures/terminatedStatusAccountsResponse.json');

describe('CVS Partner Login Service', () => {
  describe('accountsMembershipsValidator', () => {
    describe('execute()', () => {
      it('returns invalid false if the accounts and memberships responses are as expected', () => {
        let result = accountsMembershipsValidator.execute(validAccountsResponse, validMembershipsResponse);
        expect(result.invalid).to.be.false;
      });

      it('returns invalid true if the accounts response is a 555', () => {
        let result = accountsMembershipsValidator.execute(apic555Response, validMembershipsResponse);
        expect(result.invalid).to.be.true;
        expect(result.error).to.not.be.empty;
      });

      it('returns invalid true if the accounts response is empty', () => {
        let result = accountsMembershipsValidator.execute(emptyResponse, validMembershipsResponse);
        expect(result.invalid).to.be.true;
      });

      it('returns invalid true if the accounts resourceId is empty', () => {
        let result = accountsMembershipsValidator.execute(emptyAccountsResourceId, validMembershipsResponse);
        expect(result.invalid).to.be.true;
      });

      it('returns invalid true if the account is expired', () => {
        let result = accountsMembershipsValidator.execute(expiredAccountsResponse, validMembershipsResponse);
        expect(result.invalid).to.be.true;
      });

      it('returns invalid true if the account status is not actively covered', () => {
        let result = accountsMembershipsValidator.execute(terminatedStatusAccountsResponse, validMembershipsResponse);
        expect(result.invalid).to.be.true;
      });

      it('returns invalid true if the account is termed', () => {
        let result = accountsMembershipsValidator.execute(termedAccountsResponse, validMembershipsResponse);
        expect(result.invalid).to.be.true;
      });

      it('returns invalid true if the memberships response is a 555', () => {
        let result = accountsMembershipsValidator.execute(validAccountsResponse, apic555Response);
        expect(result.invalid).to.be.true;
      });

      it('returns invalid true if the memberships response is empty', () => {
        let result = accountsMembershipsValidator.execute(validAccountsResponse, emptyResponse);
        expect(result.invalid).to.be.true;
      });
    });
  });
});
