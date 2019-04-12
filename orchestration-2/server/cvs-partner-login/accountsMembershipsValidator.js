const util = require('./../typeahead/util');
const logger = util.logger();

const isApicResponseError = (apicResponse) => {
  return (apicResponse && (apicResponse.hasOwnProperty('response') && apicResponse.response.status === 555));
};

const isApicResponseInvalid = (apicResponse) => {
  return (!apicResponse || Object.keys(apicResponse).length === 0 || apicResponse.length === 0);
};

const isResourceIdUndefined = (accounts) => {
  for (let membership of accounts.data.accountResponse.accountDetail.readAccount.memberships) {
    return membership.membershipIdentifier.resourceId.length === 0;
  }
};

const isDateTimeEndCurrent = (membership) => {
  const now = Date.now();
  const dateTimeEnd = membership.effectivePeriod.datetimeEnd;
  return Date.parse(dateTimeEnd) > now;
};

const isStatusActivelyCovered = (membership) => {
  return membership.status.toUpperCase() === 'ACTIVELY COVERED';
};

const isAccountUntermed = (accounts) => {
  for (let membership of accounts.data.accountResponse.accountDetail.readAccount.memberships) {
    if(isDateTimeEndCurrent(membership) &&  isStatusActivelyCovered(membership)) {
      return true;
    }
  }

  return false;
};

const isAccountTermed = (accounts) => {
  return !isAccountUntermed(accounts);
};

const invalidate = (validationError) => {
  return { invalid: true, error: validationError };
};

const execute = (accounts, memberships) => {
  let validationError;

  if(isApicResponseError(accounts)) {
    validationError = { data: { status: 401, service: 'accounts', message: '555 apic response' } };
    logger.error(`Error ${JSON.stringify(validationError)}`);

    return invalidate(validationError);
  } else if(isApicResponseInvalid(accounts)) {
    validationError = { data: { status: 401, service: 'accounts', message: 'no accounts object' } };
    logger.error(`Error ${JSON.stringify(validationError)}`);

    return invalidate(validationError);
  } else if(isResourceIdUndefined(accounts)) {
    validationError = { data: { status: 401, service: 'accounts', message: 'no resourceId' } };
    logger.error(`Error ${JSON.stringify(validationError)}`);

    return invalidate(validationError);
  } else if(isAccountTermed(accounts)) {
    validationError = { data: { status: 403, service: 'accounts', message: 'account termed' } };
    logger.error(`Error ${JSON.stringify(validationError)}`);

    return invalidate(validationError);
  }

  if(isApicResponseError(memberships)) {
    validationError = { data: { status: 401, service: 'memberships', message: '555 apic response' } };
    logger.error(`Error ${JSON.stringify(validationError)}`);

    return invalidate(validationError);
  } else if(isApicResponseInvalid(memberships)) {
    validationError = { data: { status: 401, service: 'memberships', message: 'no memberships object' } };
    logger.error(`Error ${JSON.stringify(validationError)}`);

    return invalidate(validationError);
  }

  return { invalid: false };
};

module.exports = { execute };
