const { expect } = require('chai');
const _ = require('lodash');
const features = require('./../../../../server/features');
const rabbit = require('./../../../../server/typeahead/adapters/rabbit');
const medicationFixture = require('../fixtures/medication.json');
const facilityFixture = require('../fixtures/facility.json');
const providerFixture = require('../fixtures/provider.json');
const proceduresFixture = require('../fixtures/procedures.json');
const specialtyFixture = require('../fixtures/specialty.json');
const specialtiesAndMedicationsFixture = require('../fixtures/specialtiesAndMedications.json');
const supplementalFixture = require('../fixtures/supplemental.json');
const telemedicineFixture = require('../fixtures/telemedicine.json');

describe('rabbit', () => {
  beforeEach(function() {
    if (!features.typeahead) return this.skip();
  });
  describe('handleMessage', () => {
    context('empty arguments', () => {
      const result = rabbit.handleMessage();
      expect(result.nextResponse).to.eql({});
    });

    context('message contains results key', () => {
      it('returns next response', () => {
        const result = rabbit.handleMessage({
          message: { data: { results: [] } },
          response: { test: 'response' }
        });

        expect(result.nextResponse).to.eql({
          test: 'response'
        });
      });

      it('return indicates started message', () => {
        const result = rabbit.handleMessage({
          message: { data: { results: [] } }
        });

        expect(result.isStartedMessage).to.equal(false);
      });

      it('return indicates finished message', () => {
        const result = rabbit.handleMessage({
          message: { data: { results: [] } }
        });

        expect(result.isFinishedMessage).to.equal(true);
      });
    });

    context('message data is empty', () => {
      it('returns next response', () => {
        const result = rabbit.handleMessage({
          message: { data: {} },
          response: { test: 'response' }
        });

        expect(result.nextResponse).to.eql({
          test: 'response'
        });
      });

      it('return indicates started message', () => {
        const result = rabbit.handleMessage({
          message: { data: {} }
        });

        expect(result.isStartedMessage).to.equal(true);
      });

      it('return indicates finished message', () => {
        const result = rabbit.handleMessage({
          message: { data: {} }
        });

        expect(result.isFinishedMessage).to.equal(false);
      });
    });

    it('parses medications', () => {
      const result = rabbit.handleMessage({
        message: { data: medicationFixture.data },
        response: { medications: [] }
      });

      expect(result.nextResponse).to.eql({
        medications: medicationFixture.data.results
      });
    });

    it('parses providers', () => {
      const result = rabbit.handleMessage({
        message: { data: providerFixture.data },
        response: { find_care: [] }
      });

      expect(result.nextResponse).to.eql({
        find_care: providerFixture.data.results
      });
    });

    it('parses facilities', () => {
      const result = rabbit.handleMessage({
        message: { data: facilityFixture.data },
        response: { find_care: [] }
      });

      expect(result.nextResponse).to.eql({
        find_care: facilityFixture.data.results
      });
    });

    it('parses procedures', () => {
      const result = rabbit.handleMessage({
        message: { data: proceduresFixture.data },
        response: { health_info: [] }
      });

      expect(result.nextResponse).to.eql({
        health_info: proceduresFixture.data.results
      });
    });

    it('parses specialty', () => {
      const result = rabbit.handleMessage({
        message: { data: specialtyFixture.data },
        response: { find_care: [] }
      });

      expect(result.nextResponse).to.eql({
        find_care: specialtyFixture.data.results
      });
    });

    it('parses specialties and medications', () => {
      const result = rabbit.handleMessage({
        message: { data: specialtiesAndMedicationsFixture.data },
        response: { find_care: [], medications: [] }
      });

      expect(result.nextResponse).to.eql({
        find_care: _.filter(specialtiesAndMedicationsFixture.data.results, {
          type: 'specialty'
        }),
        medications: _.filter(specialtiesAndMedicationsFixture.data.results, {
          type: 'medication'
        })
      });
    });

    it('sorts specialties before providers', () => {
      const result = rabbit.handleMessage({
        message: { data: specialtyFixture.data },
        response: { find_care: [{ id: 'test' }] }
      });

      expect(result.nextResponse.find_care).to.have.deep.ordered.members([
        ...specialtyFixture.data.results,
        { id: 'test' }
      ]);
    });

    it('sorts specialties after telemedicine', () => {
      const result = rabbit.handleMessage({
        message: { data: specialtyFixture.data },
        response: { find_care: [{ type: 'telemedicine' }] }
      });

      expect(result.nextResponse.find_care).to.have.deep.ordered.members([
        { type: 'telemedicine' },
        ...specialtyFixture.data.results
      ]);
    });

    it('parses supplemental', () => {
      const result = rabbit.handleMessage({
        message: { data: supplementalFixture.data },
        response: { find_care: [] }
      });

      expect(result.nextResponse).to.eql({
        find_care: supplementalFixture.data.results
      });
    });

    it('sorts telemedicine before specialty and providers', () => {
      const result = rabbit.handleMessage({
        message: { data: telemedicineFixture.data },
        response: {
          find_care: [
            { type: 'specialty' },
            { type: 'practitioner' },
            { type: 'facility' }
          ]
        }
      });

      expect(result.nextResponse.find_care).to.have.deep.ordered.members([
        ...telemedicineFixture.data.results,
        { type: 'specialty' },
        { type: 'practitioner' },
        { type: 'facility' }
      ]);
    });
  });
});
