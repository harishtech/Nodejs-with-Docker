require('dotenv').config();
const { expect } = require('chai');
const request = require('supertest');

const app = require('./../../../server/server');
const provider_npi = 1073740304;

// these run slow

describe('routes integration', function() {
  if(typeof(process.env.DOCASAP_ID) === 'undefined' || typeof(process.env.DOCASAP_SECRET) === 'undefined') {
    console.log('You must add the DocASAP ID and/or Secret to your test call.');
    return false;
  }

  this.timeout(5000);

  describe('GET /healthcheck', () => {
    it('returns a 200', (done) => {
      request(app)
        .get('/healthcheck')
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
    });
  });

  describe('POST /docasap/v1/Providers/v1/GetProviderStatus', () => {
    it('returns a 200', (done) => {
      request(app)
        .post('/docasap/v1/Providers/v1/GetProviderStatus')
        .send({'provider_npi': provider_npi})
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
    });
  });

  describe('POST /docasap/v1/Providers/v1/GetProviderLocations', () => {
    it('returns a 200', (done) => {
      request(app)
        .post('/docasap/v1/Providers/v1/GetProviderLocations')
        .send({'provider_npi': provider_npi})
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
    });
  });

  describe('POST /docasap/v1/Providers/v1/GetProviderTopVisitReasons', () => {
    it('returns a 200', (done) => {
      request(app)
        .post('/docasap/v1/Providers/v1/GetProviderTopVisitReasons')
        .send({'provider_npi': provider_npi})
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
    });
  });

  describe('POST /docasap/v1/Providers/v1/GetProviderReasonSchedule', () => {
    it('returns a 200', (done) => {
      request(app)
        .post('/docasap/v1/Providers/v1/GetProviderReasonSchedule')
        .send(
          {
            'provider_npi': provider_npi,
            'da_location_id': 229161,
            'da_reason_id' : 11637
          })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
    });
  });

  describe('POST /docasap/v1/Providers/v1/GetProviderReasonScheduleWorkflowNext', () => {
    it('returns a 200', (done) => {
      request(app)
        .post('/docasap/v1/Providers/v1/GetProviderReasonScheduleWorkflowNext')
        .send(
          {
            'provider_npi': provider_npi,
            'da_location_id': 229161,
            'da_reason_id': 11640,
            'input_workflow_node': {
              'da_workflow_node_id': 7056,
              'input_workflow_questions': [
                {
                  'da_workflow_question_id': 18,
                  'user_answer': [
                    '1990-01-01'
                  ]
                }
              ]
            }
          })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
    });
  });

  describe('POST /docasap/v1/Providers/v1/GetProviderOperationalQuestions', () => {
    it('returns a 200', (done) => {
      request(app)
        .post('/docasap/v1/Providers/v1/GetProviderOperationalQuestions')
        .send(
          {
            'provider_npi': provider_npi,
            'da_location_id': 229161,
            'da_final_reason_id' : 15537
          })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
    });
  });

  describe('POST /docasap/v1/Providers/v1/BookAppointment', () => {
    it('returns a 200', (done) => {
      request(app)
        .post('/docasap/v1/Providers/v1/BookAppointment')
        .send(
          {
            'provider_npi': provider_npi,
            'da_location_id': 229161,
            'da_final_reason_id': 15537,
            'da_slot_info': 'a:10:{s:16:"is_same_day_slot";i:0;s:4:"time";i:1547501400;s:7:"slot_id";s:7:"8315772";s:16:"external_slot_id";s:0:"";s:9:"slot_type";i:3;s:13:"slot_duration";i:1800;s:18:"external_reason_id";N;s:9:"reason_id";i:15537;s:11:"appt_offset";s:1:"0";s:11:"resource_id";i:0;}',
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
              'da_workflow_question_id': 18,
              'user_answer': [
                '1994-01-01'
              ]
            }, {
              'da_workflow_question_id': 19,
              'user_answer': [
                'Yes'
              ]
            }],

            'platform': 'M'
          }
        )
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
    });
  });

});
