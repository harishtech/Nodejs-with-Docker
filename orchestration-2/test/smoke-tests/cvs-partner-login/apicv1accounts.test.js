require('dotenv').config();
const { expect } = require('chai');
const request = require('supertest');

const app = require('./../../../server/server');

describe('GET /apic/v1/accounts', function() {
  it('responds with accounts data', function(done) {
    request(app)
      .get('/apic/v1/accounts')
      .set('eieheaderaction', 'READ')
      .set('eieheaderorchestratingapplicationidentifier', '{"applicationIdentifier":{"idSource":108,"idValue":"451ca1b1-c90b-4e9e-96b5-f4a0d5bbd2b6","idType":"applications"}}')
      .set('eieheaderversion', '{"eieHeaderVersion":{"major":2,"minor":0,"maintenance":0}}')
      .set('eieheaderapplicationidentifier', '{"applicationIdentifier":{"idSource":108,"idValue":"451ca1b1-c90b-4e9e-96b5-f4a0d5bbd2b6","idType":"applications"}}')
      .set('eieheaderusercontext', '{"eieHeaderUserContext":{"dnAccountName":"","assuranceLevel":"2","eieHeaderAuthorizedRole":[{"authorizedRole":"subscriber"}, {"authorizedRole":"memberSubscriber1"}],"accountIdentifier":{"idSource":"5","idValue":"QASP1-SUB-181687666","idType":"accounts"}}}')
      .set('eieheadertransactionid', '95495635')
      .end((err, res) => {
        if(err) return done(err);
        const jsonResponse = JSON.parse(res.text);
        expect(res.status).to.eq(200);
        expect(jsonResponse.accountResponse.accountDetail.readAccount.individual.person.dateOfBirth).to.eq('1966-11-11');
        done();
      });
  });
});
