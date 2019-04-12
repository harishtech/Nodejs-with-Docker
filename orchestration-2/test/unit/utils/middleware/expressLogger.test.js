const { expect } = require('chai');
const { shouldLog } = require('./../../../../server/utils/middleware/expressLogger');

describe('Logging req/res to our microservice', () => {
  describe('shouldLog()', () => {
    describe('cvs routes', () => {
      it('returns true for cvs', () => {
        expect(shouldLog('cvs')).to.equal(true);
      });
    });

    describe('apic routes', () => {
      it('returns true for cvs', () => {
        expect(shouldLog('apic')).to.equal(true);
      });
    });

    describe('healthcheck routes', () => {
      it('returns true for cvs', () => {
        expect(shouldLog('healthcheck')).to.equal(false);
      });
    });

    describe('docasap routes', () => {
      it('returns true for cvs', () => {
        expect(shouldLog('docasap')).to.equal(false);
      });
    });

    describe('typeahead routes', () => {
      it('returns true for cvs', () => {
        expect(shouldLog('typeahead')).to.equal(false);
      });
    });

    describe('teledoc routes', () => {
      it('returns true for cvs', () => {
        expect(shouldLog('teledoc')).to.equal(false);
      });
    });
  });
});
