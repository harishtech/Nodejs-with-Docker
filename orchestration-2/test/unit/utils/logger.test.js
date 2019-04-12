const { expect } = require('chai');
const merge = require('lodash.merge');

const { logger, redactBody } = require('./../../../server/utils/logger');

describe('Logging functionality', () => {
  describe('logger()', () => {
    describe('when the NODE_ENVIRONMENT is test', () => {
      beforeEach(() => {
        process.env.NODE_ENVIRONMENT = 'test';
      });

      it('returns a silent logger, where all message functions are defined as a NOOP', () => {
        const silentLogger = logger();

        expect(silentLogger.trace.toString()).to.include('noop');
        expect(silentLogger.debug.toString()).to.include('noop');
        expect(silentLogger.info.toString()).to.include('noop');
        expect(silentLogger.warn.toString()).to.include('noop');
        expect(silentLogger.error.toString()).to.include('noop');
        expect(silentLogger.fatal.toString()).to.include('noop');
      });
    });

    describe('when the NODE_ENVIRONMENT is not test', () => {
      beforeEach(() => {
        process.env.NODE_ENVIRONMENT = 'development';
      });

      afterEach(() => {
        process.env.NODE_ENVIRONMENT = 'test';
      });

      it('returns a logger where all messages above the "info" level will be logged', () => {
        const defaultLogger = logger();

        expect(defaultLogger.trace.toString()).to.include('noop');
        expect(defaultLogger.debug.toString()).to.include('noop');
        expect(defaultLogger.info.toString()).to.include('LOG');
        expect(defaultLogger.warn.toString()).to.include('LOG');
        expect(defaultLogger.error.toString()).to.include('LOG');
        expect(defaultLogger.fatal.toString()).to.include('LOG');
      });
    });
  });

  describe('redactLog', () => {
    const redacted = '[REDACTED]';
    const base = {
      peru: { animals: 'alpaca' },
      membershipResponse: {
        id: 'unicorn',
        membershipDetail: {
          person: { height: 'hobbit' },
          pet: 'delphi'
        }
      }
    };

    it('should remove tobaccoUse', () => {
      const json = merge({
        membershipResponse: {
          membershipDetail: {
            person: { tobaccoUse: true }
          }
        }
      }, base);
      const actual = redactBody(json);
      const tobaccoUse = actual.membershipResponse.membershipDetail.person.tobaccoUse;
      expect(tobaccoUse).to.eql(redacted);
    });

    it('should remove medicareMembership', () => {
      const json = merge({
        membershipResponse: {
          membershipDetail: {
            medicareMembership: {
              id: 'yak'
            }
          }
        }
      }, base);
      const actual = redactBody(json);
      const medicareMembership = actual.membershipResponse.membershipDetail.medicareMembership;
      expect(medicareMembership).to.eql(redacted);
    });

    it('should remove medicareIdentifier', () => {
      const json = merge({
        membershipResponse: {
          membershipDetail: {
            medicareIdentifier: {
              id: 'yak'
            }
          }
        }
      }, base);
      const actual = redactBody(json);
      const medicareIdentifier = actual.membershipResponse.membershipDetail.medicareIdentifier;
      expect(medicareIdentifier).to.eql(redacted);
    });

    it('should do nothing if no violations', () => {
      const actual = redactBody(base);
      expect(actual).to.eql(base);
    });
  });
});
