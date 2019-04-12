const dobConverter = (dob) => {
  const [year, month, day] = dob.split('-');
  return`${month}/${day}/${year}`;
};

const munge = (memberData) => {
  return {
    firstname: memberData.membershipResponse.membershipDetail.person.nameFirst,
    lastname: memberData.membershipResponse.membershipDetail.person.nameLast,
    dob: dobConverter(memberData.membershipResponse.membershipDetail.person.dateOfBirth),
    memberid: 'W' + memberData.membershipResponse.membershipDetail.memberId,
    timestamp: Date.now(),
    issuer: process.env.TELEDOC_ISSUER,
    group: 'AETNA',
  };
};

const execute = (membershipResponse) => {
  const teledocEncryptor = require('./encryptor');

  const payload = munge(membershipResponse);
  const encryptedResponse = teledocEncryptor.encrypt({ payload });

  return { 'status': 200, 'data': { 'teledocssotoken': encryptedResponse } };
};

module.exports = { execute };
