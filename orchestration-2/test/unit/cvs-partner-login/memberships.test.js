const { expect } = require('chai');
const nock = require('nock');

const memberships = require('./../../../server/cvs-partner-login/memberships');

const apicPath = 'qapath1';
const membershipId = '5~263956676+10+1+20170101+751880+A+1';
const bearerToken = 'AAEkZmQ4Njc2OTYtNmI4YS00NDY1LWE0NjAtZDZjZTNmYmFjODEx7JmEY4HgOUxrJtx1ou3wZo919OScKQ3tOj8ei2K2aRqEQ4Qh98AbBxtPDrVru97e32O1EB_YORqnqpOnXHKSrLQozmg9i-J0swkdoBt5xm1p3oqqlk3nIamX3dMVWTmc';
const headers = {
  'eieheaderaction': 'READ',
  'eieheaderorchestratingapplicationidentifier': '{"applicationIdentifier":{"idSource":108,"idValue":"451ca1b1-c90b-4e9e-96b5-f4a0d5bbd2b6","idType":"applications"}}',
  'eieheaderversion': '{"eieHeaderVersion":{"major":2,"minor":0,"maintenance":0}}',
  'eieheaderapplicationidentifier': '{"applicationIdentifier":{"idSource":108,"idValue":"451ca1b1-c90b-4e9e-96b5-f4a0d5bbd2b6","idType":"applications"}}',
  'eieheaderusercontext': '{"eieHeaderUserContext":{"dnAccountName":"","assuranceLevel":"2","eieHeaderAuthorizedRole":[{"authorizedRole":"subscriber"}, {"authorizedRole":"memberSubscriber1"}],"accountIdentifier":{"idSource":"1","idValue":"QA2-SUB-263956676","idType":"accounts"}}} ',
  'eieheadertransactionid': '95495635'
};
const membershipsResponse = {
  'membershipResponse': {
    'membershipDetail': {
      'status': 'Actively Covered',
      'memberId': '263956676',
      'sequenceNumber': '01',
      'membershipIdentifier': {
        'idSource': '5',
        'idValue': '263956676+10+1+20170101+751880+A+1',
        'idType': 'memberships',
        'resourceId': '5~263956676+10+1+20170101+751880+A+1'
      }
    }
  }
};

describe('CVS Partner Login Service APIC Memberships', () => {
  describe('fetch()', () => {

    beforeEach(() => {
      nock('https://qaapih1.int.aetna.com', {
        reqheaders: {
          'accept': 'application/json, text/plain, */*',
          'authorization': 'Bearer AAEkZmQ4Njc2OTYtNmI4YS00NDY1LWE0NjAtZDZjZTNmYmFjODEx7JmEY4HgOUxrJtx1ou3wZo919OScKQ3tOj8ei2K2aRqEQ4Qh98AbBxtPDrVru97e32O1EB_YORqnqpOnXHKSrLQozmg9i-J0swkdoBt5xm1p3oqqlk3nIamX3dMVWTmc',
          'eieheaderaction': 'READ',
          'eieheaderorchestratingapplicationidentifier': '{"applicationIdentifier":{"idSource":108,"idValue":"451ca1b1-c90b-4e9e-96b5-f4a0d5bbd2b6","idType":"applications"}}',
          'eieheaderversion': '{"eieHeaderVersion":{"major":2,"minor":0,"maintenance":0}}',
          'eieheaderapplicationidentifier': '{"applicationIdentifier":{"idSource":108,"idValue":"451ca1b1-c90b-4e9e-96b5-f4a0d5bbd2b6","idType":"applications"}}',
          'eieheaderusercontext': '{"eieHeaderUserContext":{"dnAccountName":"","assuranceLevel":"2","eieHeaderAuthorizedRole":[{"authorizedRole":"subscriber"}, {"authorizedRole":"memberSubscriber1"}],"accountIdentifier":{"idSource":"1","idValue":"QA2-SUB-263956676","idType":"accounts"}}} ',
          'eieheadertransactionid': '95495635'
        }
      })
        .get(`/healthcare/${apicPath}/at/v5/memberships/${membershipId}`)
        .reply(200, membershipsResponse);
    });

    after(() => {
      nock.cleanAll();
    });

    it('returns membership information', async () => {

      const apicMemberships = await memberships.fetch({ membershipId, headers, bearerToken });

      expect(apicMemberships.data.membershipResponse.membershipDetail.memberId).to.equal(membershipsResponse.membershipResponse.membershipDetail.memberId);
      expect(apicMemberships.status).to.equal(200);
    });
  });

  describe('Error Handling', () => {
    describe('when APIC returns a 401 error', () => {
      const apic401Error = {
        'httpCode': '401',
        'httpMessage': 'Unauthorized',
        'moreInformation': 'App token might have expired'
      };

      const retryResponse = {
        'membershipResponse': 'SUCCESS!'
      };

      beforeEach(() => {
        nock('https://qaapih1.int.aetna.com')
          .get(`/healthcare/${apicPath}/at/v5/memberships/${membershipId}`)
          .reply(401, apic401Error);

        nock('https://qaapih1.int.aetna.com')
          .get(`/healthcare/${apicPath}/at/v5/memberships/${membershipId}`)
          .reply(200, retryResponse);
      });

      after(() => {
        nock.cleanAll();
      });

      it('retries the request and returns the retried response (which uses all of the nocks that were setup)', async () => {
        const apicMemberships = await memberships.fetch({ membershipId, headers, bearerToken });

        expect(apicMemberships.status).to.equal(200);
        expect(apicMemberships.data.membershipResponse).to.equal(retryResponse.membershipResponse);

        expect(nock.isDone()).to.be.true;
        expect(nock.pendingMocks().length).to.eq(0);
      });
    });

    describe('APIC 404 Error', () => {
      const apicError = {
        'httpCode': '404',
        'httpMessage': 'Not Found',
        'moreInformation': 'No resources match requested URI'
      };

      beforeEach(() => {
        nock('https://qaapih1.int.aetna.com')
          .get(`/healthcare/${apicPath}/at/v5/memberships/${membershipId}`)
          .reply(404, apicError);
      });

      after(() => {
        nock.cleanAll();
      });

      it('returns the appropriately converted error response', async () => {
        const apicMemberships = await memberships.fetch({ membershipId, headers, bearerToken });

        expect(apicMemberships.status).to.equal(500);
        expect(apicMemberships.data.status).to.equal(500);
        expect(apicMemberships.data.title).to.equal('Internal Server Error');
        expect(apicMemberships.data.detail).to.equal(apicError.moreInformation);
      });
    });

    describe('APIC 405 Error', () => {
      const apicError = {
        'httpCode': '405',
        'httpMessage': 'Method Not Allowed',
        'moreInformation': 'Additional error details'
      };

      beforeEach(() => {
        nock('https://qaapih1.int.aetna.com')
          .get(`/healthcare/${apicPath}/at/v5/memberships/${membershipId}`)
          .reply(405, apicError);
      });

      after(() => {
        nock.cleanAll();
      });

      it('returns the appropriately converted error response', async () => {
        const apicMemberships = await memberships.fetch({ membershipId, headers, bearerToken });

        expect(apicMemberships.status).to.equal(500);
        expect(apicMemberships.data.status).to.equal(500);
        expect(apicMemberships.data.title).to.equal('Internal Server Error');
        expect(apicMemberships.data.detail).to.equal(apicError.moreInformation);
      });
    });

    describe('APIC 406 Error', () => {
      const apicError = {
        'httpCode': '406',
        'httpMessage': 'Not Acceptable',
        'moreInformation': 'Additional Error details'
      };

      beforeEach(() => {
        nock('https://qaapih1.int.aetna.com')
          .get(`/healthcare/${apicPath}/at/v5/memberships/${membershipId}`)
          .reply(405, apicError);
      });

      after(() => {
        nock.cleanAll();
      });

      it('returns the appropriately converted error response', async () => {
        const apicMemberships = await memberships.fetch({ membershipId, headers, bearerToken });

        expect(apicMemberships.status).to.equal(500);
        expect(apicMemberships.data.status).to.equal(500);
        expect(apicMemberships.data.title).to.equal('Internal Server Error');
        expect(apicMemberships.data.detail).to.equal(apicError.moreInformation);
      });
    });

    describe('APIC 429 Error', () => {
      const apicError = {
        'httpCode': '429',
        'httpMessage': 'Too Many Requests',
        'moreInformation': 'Additional Error details'
      };

      beforeEach(() => {
        nock('https://qaapih1.int.aetna.com')
          .get(`/healthcare/${apicPath}/at/v5/memberships/${membershipId}`)
          .reply(428, apicError);
      });

      after(() => {
        nock.cleanAll();
      });

      it('returns the appropriately converted error response', async () => {
        const apicMemberships = await memberships.fetch({ membershipId, headers, bearerToken });

        expect(apicMemberships.status).to.equal(429);
        expect(apicMemberships.data.status).to.equal(429);
        expect(apicMemberships.data.title).to.equal('Too Many Requests');
        expect(apicMemberships.data.detail).to.equal(apicError.moreInformation);
      });
    });

    describe('APIC 500 Error', () => {
      const apicError = {
        'httpCode': '500',
        'httpMessage': 'Internal Server Error',
        'moreInformation': 'Additional Error details'
      };

      beforeEach(() => {
        nock('https://qaapih1.int.aetna.com')
          .get(`/healthcare/${apicPath}/at/v5/memberships/${membershipId}`)
          .reply(500, apicError);
      });

      after(() => {
        nock.cleanAll();
      });

      it('returns the appropriately converted error response', async () => {
        const apicMemberships = await memberships.fetch({ membershipId, headers, bearerToken });

        expect(apicMemberships.status).to.equal(503);
        expect(apicMemberships.data.status).to.equal(503);
        expect(apicMemberships.data.title).to.equal('Service Unavailable');
        expect(apicMemberships.data.detail).to.equal(apicError.moreInformation);
      });
    });

    describe('APIC 503 Error', () => {
      const apicError = {
        'httpCode': '503',
        'httpMessage': 'Service Unavailable',
        'moreInformation': 'Additional Error details'
      };

      beforeEach(() => {
        nock('https://qaapih1.int.aetna.com')
          .get(`/healthcare/${apicPath}/at/v5/memberships/${membershipId}`)
          .reply(503, apicError);
      });

      after(() => {
        nock.cleanAll();
      });

      it('returns the appropriately converted error response', async () => {
        const apicMemberships = await memberships.fetch({ membershipId, headers, bearerToken });

        expect(apicMemberships.status).to.equal(503);
        expect(apicMemberships.data.status).to.equal(Number(apicError.httpCode));
        expect(apicMemberships.data.title).to.equal(apicError.httpMessage);
        expect(apicMemberships.data.detail).to.equal(apicError.moreInformation);
      });
    });

    describe('APIC 555 Error', () => {
      const apicError = {
        'httpCode': '555',
        'httpMessage': 'Catch-all for internal IIB Errors',
        'moreInformation': 'Additional Error details'
      };

      beforeEach(() => {
        nock('https://qaapih1.int.aetna.com')
          .get(`/healthcare/${apicPath}/at/v5/memberships/${membershipId}`)
          .reply(555, apicError);
      });

      after(() => {
        nock.cleanAll();
      });

      it('returns the appropriately converted error response', async () => {
        const apicMemberships = await memberships.fetch({ membershipId, headers, bearerToken });

        expect(apicMemberships.status).to.equal(500);
        expect(apicMemberships.data.status).to.equal(500);
        expect(apicMemberships.data.title).to.equal('Internal Server Error');
        expect(apicMemberships.data.detail).to.equal(apicError.moreInformation);
      });
    });
  });
});
