const request = require('supertest');

const app = require('./../../server/server');

describe('GET /healthcheck', () => {
  it('returns a 200', (done) => {
    request(app)
      .get('/healthcheck')
      .expect(200)
      .end(done);
  });
});
