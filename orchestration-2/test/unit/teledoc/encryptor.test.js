require('dotenv').config();
const { expect } = require('chai');

const encryptor = require('./../../../server/teledoc/encryptor');

describe('Teledoc SSO token generation', () => {
  describe('encryptor', () => {
    describe('encrypt()', () => {
      it('returns a base64 encrypted value', () => {
        const result = encryptor.encrypt({ payload: 'foo' });

        expect(result).to.not.be.null;
      });
    });
  });
});
