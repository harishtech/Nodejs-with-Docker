const { expect } = require('chai');

const hmacUtility = require('./../../../server/cvs-partner-login/hmacUtility');

describe('CVS Partner Login Service', () => {
  describe('hmac utility', () => {
    const timestamp = '1533758685900';

    describe('execute()', () => {
      it('returns a Base64 encoded HMAC string based off the timestamp passed in', () => {
        expect(hmacUtility.execute({ timestamp }).hmac).to.equal('DPyhLLFCAnC/hPf3KDhL7Xa2K4/qe6hcCHar4IEOwq0=');
      });

      it('returns a Base64 encoded string based off the timestamp passed in', () => {
        expect(hmacUtility.execute({ timestamp }).timestamp).to.equal('MTUzMzc1ODY4NTkwMA==');
      });
    });
  });
});
