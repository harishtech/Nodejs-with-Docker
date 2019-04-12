const { expect } = require('chai');

const headerCustodian = require('./../../../server/cvs-partner-login/headerCustodian');

describe('CVS Partner Login Service', () => {
  describe('headerCustodian', () => {
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

    describe('sanitize()', () => {
      it('returns updated headers so that APIC will not choke on our call to accounts', () => {
        const sanitizedHeaders = headerCustodian.sanitize(headers);
        expect(sanitizedHeaders).to.not.have.property('host');
        expect(sanitizedHeaders).to.not.have.property('content-type');
        expect(sanitizedHeaders).to.not.have.property('content-length');
      });
    });

    describe('grabEieHeaders()', () => {
      it('returns only eie headers', () => {
        const eieHeaders = headerCustodian.grabEieHeaders(headers);

        expect(eieHeaders).to.have.property('eieheaderaction');
        expect(eieHeaders).to.have.property('eieheaderorchestratingapplicationidentifier');
        expect(eieHeaders).to.have.property('eieheaderversion');
        expect(eieHeaders).to.have.property('eieheaderapplicationidentifier');
        expect(eieHeaders).to.have.property('eieheaderusercontext');
        expect(eieHeaders).to.have.property('eieheadertransactionid');
        expect(eieHeaders).not.to.have.property('content-type');
        expect(eieHeaders).not.to.have.property('host');
        expect(eieHeaders).not.to.have.property('connection');
        expect(eieHeaders).not.to.have.property('user-agent');
        expect(eieHeaders).not.to.have.property('content-length');
      });
    });
  });
});

