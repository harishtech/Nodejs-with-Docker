const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');

const app = require('./../../../server/server');
const docAsapProxy = require('./../../../server/docAsap/proxy');

describe('POST /docasap/v1/Providers/v1/BookAppointment', () => {
  beforeEach(() => {
    this.features = require('./../../../server/features');
    this.docAsapProxy = sinon.stub(docAsapProxy, 'execute');
  });

  afterEach(() => {
    docAsapProxy.execute.restore();
  });

  it('invokes execute() once', (done) => {
    this.docAsapProxy.returns({status: 200});

    request(app)
      .post('/docasap/v1/Providers/v1/BookAppointment')
      .send(
        {
          'provider_npi': 1922053958,
          'da_location_id': 229125,
          'da_final_reason_id': 5109,
          'da_slot_info': {
            'is_same_day_slot': 0,
            'time': 1529433000,
            'slot_id': '9088',
            'external_slot_id': '0',
            'slot_type': 4,
            'slot_duration': 900,
            'external_reason_id': 0,
            'reason_id': 0,
            'appt_offset': 0,
            'resource_id': 0
          },
          'da_channel_code': 'aetna',
          'patient_id': 'AetnaPatient1',
          'patient_demographics': {
            'first_name': 'FirstNameAetna',
            'last_name': 'LastNameAetna',
            'dob': '2001-06-04',
            'gender': 'M',
            'address_street': 'Street',
            'address_city': 'City',
            'address_state': 'MD',
            'address_zip': '20854',
            'email': 'email@email.com',
            'cell_phone': '9999999999',
            'notification_preference': 'Text',
            'da_ins_id': 0,
            'da_ins_plan_id': 0,
            'ins_group_id': 'string',
            'ins_subscriber_id': 'string'
          },
          'scheduling_workflow_questions': [{
            'da_workflow_question_id': 19,
            'user_answer': [
              'Yes'
            ]
          }, {
            'da_workflow_question_id': 33,
            'user_answer': [
              'Yes'
            ]
          }],
          'platform': 'M'
        }
      )
      .end((err) => {
        if(err) return done(err);
        expect(docAsapProxy.execute.callCount).to.eq(1);
        done();
      });
  });
});
