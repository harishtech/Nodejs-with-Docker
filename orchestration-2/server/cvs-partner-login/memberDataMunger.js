const getFirst = (memberships) => {
  return memberships.data.membershipResponse.membershipDetail.person.nameFirst;
};

const getLast = (memberships) => {
  return memberships.data.membershipResponse.membershipDetail.person.nameLast;
};

const getGender = (memberships) => {
  return memberships.data.membershipResponse.membershipDetail.person.gender.charAt(0);
};

const getDob = (memberships) => {
  return memberships.data.membershipResponse.membershipDetail.person.dateOfBirth;
};

const getMembershipId = (memberships) => {
  let membership = memberships.data.membershipResponse.membershipDetail;

  if(membership.memberId.length != 0) {
    return membership.memberId;
  }
};

const collect = (memberships) => {
  const firstName = getFirst(memberships).toUpperCase();
  const lastName = getLast(memberships).toUpperCase();
  const gender = getGender(memberships).toUpperCase();
  const dateOfBirth = getDob(memberships).toUpperCase();
  const clientCode = 'BLNK';
  const externalId = getMembershipId(memberships);
  const response = `<partnerLoginRequest><member><firstName>${firstName}</firstName><lastName>${lastName}</lastName><gender>${gender}</gender><dateOfBirth>${dateOfBirth}</dateOfBirth></member><partner><clientCode>${clientCode}</clientCode><externalId>${externalId}</externalId></partner></partnerLoginRequest>`;

  return response;
};

module.exports = { collect };
