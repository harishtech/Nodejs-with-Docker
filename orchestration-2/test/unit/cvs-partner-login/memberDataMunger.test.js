const { expect } = require('chai');
const munger = require('./../../../server/cvs-partner-login/memberDataMunger');
const membershipResponse = require('./fixtures/validMembershipResponse.json');

describe('CVS Partner Login Service', () => {
  describe('member data munger', () => {
    describe('collect()', () => {
      it('returns a valid xml payload to pass to the CVS partner login endpoint', () => {
        const expectedMemberData = '<partnerLoginRequest><member><firstName>RENEE</firstName><lastName>TURZIANO</lastName><gender>F</gender><dateOfBirth>1984-09-14</dateOfBirth></member><partner><clientCode>BLNK</clientCode><externalId>263956676</externalId></partner></partnerLoginRequest>';
        const result = munger.collect(membershipResponse);

        expect(result).to.equal(expectedMemberData);
      });
    });
  });
});
