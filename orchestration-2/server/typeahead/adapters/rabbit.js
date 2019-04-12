const _ = require('lodash');

const handleMessage = ({ message = {}, response = {} } = {}) => {
  let nextResponse = Object.assign({}, response);

  if (!message || isStartedMessage(message))
    return {
      nextResponse,
      isStartedMessage: isStartedMessage(message),
      isFinishedMessage: isFinishedMessage(message)
    };

  if (message.data.results.find(result => result.type === 'telemedicine')) {
    nextResponse.find_care = [].concat(
      message.data.results,
      response.find_care
    );
  }

  if (message.data.results.find(result => result.type === 'specialty')) {
    nextResponse.find_care = [].concat(
      response.find_care.filter(result => result.type === 'telemedicine'),
      message.data.results.filter(result => result.type === 'specialty'),
      response.find_care.filter(result => result.type !== 'telemedicine')
    );
  }

  if (
    message.data.results.find(
      result => result.type === 'practitioner' || result.type === 'facility'
    )
  ) {
    nextResponse.find_care = response.find_care.concat(message.data.results);
  }

  if (message.data.results.find(result => result.type === 'medication')) {
    nextResponse.medications = response.medications.concat(
      message.data.results.filter(result => result.type === 'medication')
    );
  }

  if (message.data.results.find(result => result.type === 'procedure')) {
    nextResponse.health_info = response.health_info.concat(
      message.data.results
    );
  }

  return {
    nextResponse,
    isStartedMessage: isStartedMessage(message),
    isFinishedMessage: isFinishedMessage(message)
  };
};

const isStartedMessage = message => message && _.isEmpty(message.data);

const isFinishedMessage = message => !isStartedMessage(message);

const isComplete = ({ counter, totalServices }) =>
  counter <= 0 && totalServices > 1;

module.exports = {
  handleMessage,
  isComplete
};
