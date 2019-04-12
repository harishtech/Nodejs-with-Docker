require('dotenv').config();
const { expect } = require('chai');
const request = require('supertest');

const app = require('./../../../server/server');

describe('GET /apic/v1/memberships', function() {
  it('responds with membership data', function(done) {
    request(app)
      .get('/apic/v1/memberships/5~181687666+10+1+20080701+747771+A+1')
      .end((err, res) => {
        if(err) return done(err);
        const jsonResponse = JSON.parse(res.text);
        expect(res.status).to.eq(200);
        expect(jsonResponse.membershipResponse.membershipDetail.person.dateOfBirth).to.eq('1966-11-11');
        done();
      });
  });
});
