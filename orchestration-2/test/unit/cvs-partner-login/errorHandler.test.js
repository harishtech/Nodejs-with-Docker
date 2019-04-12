const { expect } = require('chai');

const errorHandler = require('./../../../server/cvs-partner-login/errorHandler');

describe('CVS Partner Login Service Error Handling', () => {
  describe('error handling', () => {
    describe('statusCode 0000', () => {
      it('returns the unchanged xml', () => {
        const payload = require('./fixtures/cvs-auth-responses/0000.json');
        const result = errorHandler.assess({ payload });

        expect(result).to.equal(payload);
      });
    });

    describe('statusCode 1001', () => {
      it('returns the expected json error', () => {
        const payload = require('./fixtures/cvs-auth-responses/1001.json');
        const result = errorHandler.assess({ payload });
        const expectedResponse = require('./fixtures/cvs-auth-responses/1001-expected.json');

        expect(result.error).to.be.true;
        expect(result.data.detail).to.equal(expectedResponse.data.detail);
        expect(result.data.status).to.equal(expectedResponse.data.status);
        expect(result.data.title).to.equal(expectedResponse.data.title);
      });
    });

    describe('statusCode 1002', () => {
      it('returns the expected json error', () => {
        const payload = require('./fixtures/cvs-auth-responses/1002.json');
        const result = errorHandler.assess({ payload });
        const expectedResponse = require('./fixtures/cvs-auth-responses/1002-expected.json');

        expect(result.error).to.be.true;
        expect(result.data.detail).to.equal(expectedResponse.data.detail);
        expect(result.data.status).to.equal(expectedResponse.data.status);
        expect(result.data.title).to.equal(expectedResponse.data.title);
      });
    });

    describe('statusCode 9999', () => {
      it('returns the expected json error', () => {
        const payload = require('./fixtures/cvs-auth-responses/9999.json');
        const result = errorHandler.assess({ payload });
        const expectedResponse = require('./fixtures/cvs-auth-responses/9999-expected.json');

        expect(result.error).to.be.true;
        expect(result.data.detail).to.equal(expectedResponse.data.detail);
        expect(result.data.status).to.equal(expectedResponse.data.status);
        expect(result.data.title).to.equal(expectedResponse.data.title);
      });
    });

    describe('statusCode 1003', () => {
      it('returns the expected json error', () => {
        const payload = require('./fixtures/cvs-auth-responses/1003.json');
        const result = errorHandler.assess({ payload });
        const expectedResponse = require('./fixtures/cvs-auth-responses/1003-expected.json');

        expect(result.error).to.be.true;
        expect(result.data.detail).to.equal(expectedResponse.data.detail);
        expect(result.data.status).to.equal(expectedResponse.data.status);
        expect(result.data.title).to.equal(expectedResponse.data.title);
      });
    });

    describe('statusCode 2003', () => {
      it('returns the expected json error', () => {
        const payload = require('./fixtures/cvs-auth-responses/2003.json');
        const result = errorHandler.assess({ payload });
        const expectedResponse = require('./fixtures/cvs-auth-responses/2003-expected.json');

        expect(result.error).to.be.true;
        expect(result.data.detail).to.equal(expectedResponse.data.detail);
        expect(result.data.status).to.equal(expectedResponse.data.status);
        expect(result.data.title).to.equal(expectedResponse.data.title);
      });
    });

    describe('statusCode 2017', () => {
      it('returns the expected json error', () => {
        const payload = require('./fixtures/cvs-auth-responses/2017.json');
        const result = errorHandler.assess({ payload });
        const expectedResponse = require('./fixtures/cvs-auth-responses/2017-expected.json');

        expect(result.error).to.be.true;
        expect(result.data.detail).to.equal(expectedResponse.data.detail);
        expect(result.data.status).to.equal(expectedResponse.data.status);
        expect(result.data.title).to.equal(expectedResponse.data.title);
      });
    });

    describe('statusCode 2021', () => {
      it('returns the expected json error', () => {
        const payload = require('./fixtures/cvs-auth-responses/2021.json');
        const result = errorHandler.assess({ payload });
        const expectedResponse = require('./fixtures/cvs-auth-responses/2021-expected.json');

        expect(result.error).to.be.true;
        expect(result.data.detail).to.equal(expectedResponse.data.detail);
        expect(result.data.status).to.equal(expectedResponse.data.status);
        expect(result.data.title).to.equal(expectedResponse.data.title);
      });
    });

    describe('statusCode 2001', () => {
      it('returns the expected json error', () => {
        const payload = require('./fixtures/cvs-auth-responses/2001.json');
        const result = errorHandler.assess({ payload });
        const expectedResponse = require('./fixtures/cvs-auth-responses/2001-expected.json');

        expect(result.error).to.be.true;
        expect(result.data.detail).to.equal(expectedResponse.data.detail);
        expect(result.data.status).to.equal(expectedResponse.data.status);
        expect(result.data.title).to.equal(expectedResponse.data.title);
      });
    });

    describe('statusCode 8002', () => {
      it('returns the expected json error', () => {
        const payload = require('./fixtures/cvs-auth-responses/8002.json');
        const result = errorHandler.assess({ payload });
        const expectedResponse = require('./fixtures/cvs-auth-responses/8002-expected.json');

        expect(result.error).to.be.true;
        expect(result.data.detail).to.equal(expectedResponse.data.detail);
        expect(result.data.status).to.equal(expectedResponse.data.status);
        expect(result.data.title).to.equal(expectedResponse.data.title);
      });
    });

    describe('any statusCode that is not covered by the CVS documentation we have', () => {
      it('returns the expected json error', () => {
        const payload = require('./fixtures/cvs-auth-responses/unknownError.json');
        const result = errorHandler.assess({ payload });
        const expectedResponse = require('./fixtures/cvs-auth-responses/unknownError-expected.json');

        expect(result.error).to.be.true;
        expect(result.data.detail).to.equal(expectedResponse.data.detail);
        expect(result.data.status).to.equal(expectedResponse.data.status);
        expect(result.data.title).to.equal(expectedResponse.data.title);
      });
    });
  });

  describe('assessApicError()', () => {
    describe('non-APIC error', () => {
      it('returns the original error', () => {
        const error = new Error('blasny blasny');
        const errorHandlerResult = errorHandler.assessApicError(error);

        expect(errorHandlerResult).to.equal(error);
      });
    });

    describe('APIC error conversions', () => {
      it('converts moreInformation to detail', () => {
        const apicError = { response: { data: { httpCode: '404', moreInformation: 'No resources match requested URI' }}};
        const errorHandlerResult = errorHandler.assessApicError(apicError);

        expect(errorHandlerResult.data.detail).to.equal(apicError.response.data.moreInformation);
      });
    });

    describe('APIC httpCode 401', () => {
      it('returns a custom 503 error response', () => {
        const apicError = { response: { data: { httpCode: '401' }}};
        const errorHandlerResult = errorHandler.assessApicError(apicError);

        expect(errorHandlerResult.status).to.equal(503);
        expect(errorHandlerResult.data.status).to.equal(503);
        expect(errorHandlerResult.data.title).to.equal('Service Unavailable');
      });
    });

    describe('APIC httpCode 404', () => {
      it('returns a custom 500 error response', () => {
        const apicError = { response: { data: { httpCode: '404' }}};
        const errorHandlerResult = errorHandler.assessApicError(apicError);

        expect(errorHandlerResult.status).to.equal(500);
        expect(errorHandlerResult.data.status).to.equal(500);
        expect(errorHandlerResult.data.title).to.equal('Internal Server Error');
      });
    });

    describe('APIC httpCode 405', () => {
      it('returns a custom 500 error response', () => {
        const apicError = { response: { data: { httpCode: '405' }}};
        const errorHandlerResult = errorHandler.assessApicError(apicError);

        expect(errorHandlerResult.status).to.equal(500);
        expect(errorHandlerResult.data.status).to.equal(500);
        expect(errorHandlerResult.data.title).to.equal('Internal Server Error');
      });
    });

    describe('APIC httpCode 406', () => {
      it('returns a custom 500 error response', () => {
        const apicError = { response: { data: { httpCode: '406' }}};
        const errorHandlerResult = errorHandler.assessApicError(apicError);

        expect(errorHandlerResult.status).to.equal(500);
        expect(errorHandlerResult.data.status).to.equal(500);
        expect(errorHandlerResult.data.title).to.equal('Internal Server Error');
      });
    });

    describe('APIC httpCode 429', () => {
      it('returns a custom 429 error response', () => {
        const apicError = { response: { data: { httpCode: '429' }}};
        const errorHandlerResult = errorHandler.assessApicError(apicError);

        expect(errorHandlerResult.status).to.equal(429);
        expect(errorHandlerResult.data.status).to.equal(429);
        expect(errorHandlerResult.data.title).to.equal('Too Many Requests');
      });
    });

    describe('APIC httpCode 500', () => {
      it('returns a custom 503 error response', () => {
        const apicError = { response: { data: { httpCode: '500' }}};
        const errorHandlerResult = errorHandler.assessApicError(apicError);

        expect(errorHandlerResult.status).to.equal(503);
        expect(errorHandlerResult.data.status).to.equal(503);
        expect(errorHandlerResult.data.title).to.equal('Service Unavailable');
      });
    });

    describe('APIC httpCode 503', () => {
      it('returns a custom 503 error response', () => {
        const apicError = { response: { data: { httpCode: '503' }}};
        const errorHandlerResult = errorHandler.assessApicError(apicError);

        expect(errorHandlerResult.status).to.equal(503);
        expect(errorHandlerResult.data.status).to.equal(503);
        expect(errorHandlerResult.data.title).to.equal('Service Unavailable');
      });
    });

    describe('APIC httpCode 555', () => {
      it('returns a custom 500 error response', () => {
        const apicError = { response: { data: { httpCode: '555' }}};
        const errorHandlerResult = errorHandler.assessApicError(apicError);

        expect(errorHandlerResult.status).to.equal(500);
        expect(errorHandlerResult.data.status).to.equal(500);
        expect(errorHandlerResult.data.title).to.equal('Internal Server Error');
      });
    });
  });
});
