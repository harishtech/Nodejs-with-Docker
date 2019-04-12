const { expect } = require('chai');
const sinon = require('sinon');

const encryptor = require('./../../../server/teledoc/encryptor');
const generator = require('./../../../server/teledoc/payloadGenerator');

describe('Teledoc SSO token generation', () => {
  describe('payloadGenerator', () => {
    describe('execute()', () => {
      const encodedPayload = 'JsEi08SqykmgakQgMJ7L98W0UOKO2RDYhitnuEre+jl71xXM/p29mGEUVkVbeOwu7lc+R0OeUL/lYHUGTVc11DnQOqt4GegCVfRyxgOlqriUFY+htiC8HvdU2+KZrIPCDkxY3VnVrMtwbUN/WgpYC+oyuXAl21bR8aOeL9NJu2cASa6Ooqu7oGUlImdnXRnYQSYJz02/Qd4V73SPL7tyWefbrkdYZ1bVvBJdnJgK5Ux7mBduXatY98iQL9B2DWFl+GWW5ajvupkV2Xo2mEcARGo+GK8QjQ9bjCQd0y73SfDUZIYJdlIwb0x/0LLpTdqKHZ97c12oIQPvR/F96nDwE+bmR0gy3jHkW6xeTeq3dBWpZ2zDIrbRX93PaUW4hnVtr6f4W1A5FJZh9XcltCJP0cMLipldrZDMbYNyIwfygj7+kcI0Ax65WfGCccqpWtMB+UjNPTuYUECWeOYEqQWnIAa7kP2P24ABnukb3BdNHmdt4hV/llIZNvNA12JGTzF6mKlcm4UUf9HptImsu3WGNkw7VU6SPTsgUthjwmbne/EqdyGtQZvRoJ/4MmfqzHjtpbemJgmjMfayLU7QgrM7S3c1gEbH9orkTScLkqy+OFbeGvxKUhbqB5tRHQ9bNTggH83TzyfvYFlFd66soW0+/xl/K6/YHIYKfG6+PMFpmjw=';
      const membershipResponse = require('./fixtures/membershipResponse.json');

      after(() => {
        sinon.restore();
      });

      it('returns a response with an encoded teledocssotoken value', () => {
        sinon.stub(encryptor, 'encrypt').returns(encodedPayload);
        const response = generator.execute(membershipResponse);

        expect(response.status).to.equal(200);
        expect(response.data.teledocssotoken).to.equal(encodedPayload);
      });
    });
  });
});
