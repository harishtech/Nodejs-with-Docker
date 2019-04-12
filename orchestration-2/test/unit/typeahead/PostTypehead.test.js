const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const features = require('./../../../server/features');
const app = require('./../../../server/server');
const util = require('./../../../server/typeahead/util');
const connections = require('./../../../server/typeahead/connections');
const rabbit = require('./../../../server/typeahead/adapters/rabbit');
const providerFixture = require('./fixtures/provider.json');
const medicationFixture = require('./fixtures/medication.json');

const createChannel = sinon.stub();

let ch;
let params = {
  current_phase: 'test-phase',
  date_of_birth: 'test-birthday',
  first_name: 'test-first-name',
  gender: 'test-gender',
  group_number: 'test-group',
  latlng: 'test-latln',
  last_name: 'test-last-name',
  member_id: 'test-id'
};

describe('POST /typeahead', () => {
  beforeEach(function() {
    if (!features.typeahead) return this.skip();

    ch = {
      ack: sinon.spy(),
      cancel: sinon.spy(),
      consume: sinon.stub(),
      prefetch: sinon.spy(),
      publish: sinon.spy()
    };
    ch.consume.callsArgWithAsync(1, {
      fields: {},
      content: Buffer.from(
        JSON.stringify({ id: 'myid', data: { results: [] } })
      )
    });

    sinon.stub(util, 'uuid').returns('myid');
    sinon.stub(rabbit, 'isComplete').returns(true);
    sinon.stub(connections, 'get').returns({
      processQueue: 'myQueue',
      mqConnection: {
        createChannel: createChannel.returns(ch)
      }
    });
  });

  afterEach(() => {
    connections.get.restore();
    util.uuid.restore();
    rabbit.isComplete.restore();
  });

  it('returns a 200', done => {
    request(app)
      .post('/typeahead/v1')
      .send(params)
      .expect(200)
      .end(err => {
        expect(err).to.not.exist;
        done();
      });
  });

  it('returns provider data', done => {
    ch.consume.callsArgWithAsync(1, {
      fields: {},
      content: Buffer.from(
        JSON.stringify({ id: 'myid', data: providerFixture.data })
      )
    });

    request(app)
      .post('/typeahead/v1')
      .send(params)
      .end((err, res) => {
        expect(err).to.not.exist;
        expect(res.body).to.eql({
          uuid: 'myid',
          health_info: [],
          medications: [],
          find_care: providerFixture.data.results.map(
            ({ id, text, type, default_procedure }) => ({
              id,
              name: text,
              type,
              default_procedure
            })
          )
        });
        done();
      });
  });

  it('returns medications data', done => {
    ch.consume.callsArgWithAsync(1, {
      fields: {},
      content: Buffer.from(
        JSON.stringify({ id: 'myid', data: medicationFixture.data })
      )
    });

    request(app)
      .post('/typeahead/v1')
      .send(params)
      .end((err, res) => {
        expect(err).to.not.exist;
        expect(res.body).to.eql({
          uuid: 'myid',
          health_info: [],
          find_care: [],
          medications: medicationFixture.data.results.map(
            ({ id, text, type }) => ({
              id,
              name: text,
              type
            })
          )
        });
        done();
      });
  });

  it('publishes the request', done => {
    ch.consume.callsArgWithAsync(1, {
      fields: {},
      content: Buffer.from(
        JSON.stringify(
          Object.assign({}, { id: 'myid' }, { data: providerFixture.data })
        )
      )
    });
    request(app)
      .post('/typeahead/v1')
      .send(params)
      .end(err => {
        expect(err).to.not.exist;
        expect(
          ch.publish.calledWith(
            'orchestration_durable',
            'search.query.string.requested',
            sinon.match.any
          )
        );
        expect(ch.publish.callCount).to.equal(1);
        done();
      });
  });
});
