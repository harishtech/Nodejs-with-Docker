const { expect } = require('chai');

const accountIdGenerator = require('./../../../server/cvs-partner-login/accountIdGenerator');

describe('CVS Partner Login Service', () => {
  describe('accountIdGenerator', () => {
    describe('execute()', () => {
      const headers = { eieheaderaction: 'READ',
        eieheaderorchestratingapplicationidentifier: '{"applicationIdentifier":{"idSource":108,"idValue":"451ca1b1-c90b-4e9e-96b5-f4a0d5bbd2b6","idType":"applications"}}',
        eieheaderversion: '{"eieHeaderVersion":{"major":2,"minor":0,"maintenance":0}}',
        eieheaderapplicationidentifier: '{"applicationIdentifier":{"idSource":108,"idValue":"451ca1b1-c90b-4e9e-96b5-f4a0d5bbd2b6","idType":"applications"}}',
        eieheaderusercontext: '{"eieHeaderUserContext":{"dnAccountName":"","assuranceLevel":"2","eieHeaderAuthorizedRole":[{"authorizedRole":"subscriber"}, {"authorizedRole":"memberSubscriber1"}],"accountIdentifier":{"idSource":"1","idValue":"QA2-SUB-263956676","idType":"accounts"}}}',
        eieheadertransactionid: '95495635',
        'content-type': 'application/json; charset=utf-8',
        host: 'localhost:8080',
        connection: 'close',
        'user-agent': 'Paw/3.1.7 (Macintosh; OS X/10.12.6) GCDHTTPRequest',
        'content-length': '174' };

      it('returns an account id based on the eieheaders passed by the calling agent', () => {
        expect(accountIdGenerator.execute(headers)).to.equal('1~QA2-SUB-263956676');
      });
    });
  });
});
