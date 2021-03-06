const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');

const app = require('./../../../server/server');
const docAsapProxy = require('./../../../server/docAsap/proxy');

describe('POST /docasap/v1/Providers/v1/GetProviderReasonScheduleWorkflowNext', () => {
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
      .post('/docasap/v1/Providers/v1/GetProviderReasonScheduleWorkflowNext')
      .send(
        {
          'provider_npi': 1922053958,
          'da_location_id': 229125,
          'da_reason_id': 251,
          'input_workflow_node': {
            'da_workflow_node_id': 1294,
            'input_workflow_questions': [{
              'da_workflow_question_id': 33,
              'user_answer': [
                'Yes'
              ]
            }]
          }
        }
      )
      .end((err) => {
        if(err) return done(err);
        expect(docAsapProxy.execute.callCount).to.eq(1);
        done();
      });
  });
});
