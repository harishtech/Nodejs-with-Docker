const jwt = require('jsonwebtoken');

function bodyBuilder(body, { id, processRoutingKey }) {
  return {
    id,
    process_routing_key: processRoutingKey,
    identity: tokenizer(body),
    data: {
      value: body.q,
      behavioral_health_flag: body.behavioral_health,
      location: {
        latlng: body.latlng
      }
    }
  };
}

function tokenizer(body) {
  return jwt.sign({
    date_of_birth: body['date_of_birth'],
    first_name: body['first_name'],
    last_name: body['last_name'],
    gender: body['gender'],
    member_id: body['member_id'],
    membership_id: body['membership_id'],
    dependent_member_id: body['dependent_member_id'],
    plan_sponsor: body['plan_sponsor'],
    group_number: body['group_number'],
    current_phase: body['current_phase'],
    plan_summary: body['plan_summary'],
    control_number: body['control_number']
  }, 'my_secret');
}

module.exports = bodyBuilder;
