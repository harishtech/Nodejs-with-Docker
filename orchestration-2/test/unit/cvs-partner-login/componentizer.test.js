require('dotenv').config();
const { expect } = require('chai');

const componentizer = require('./../../../server/cvs-partner-login/componentizer');

const cvsPartnerLoginToken = '92E59DC4F5BE3FD7B130D99AB9C65E01';
const fenv = process.env.CVS_HOSTNAME.split('-')[0];
const expectedComponents = [
  {
    type: 'drug_cost',
    url: `https://${process.env.CVS_WEB_COMPONENT_BASE_URL}/FASTCheckDrugCosts/v4/#/?apiKey=${process.env.CVS_WEB_COMP_API_KEY}&apiSecret=${process.env.CVS_WEB_COMP_API_SECRET}&tokenId=${cvsPartnerLoginToken}&fenv=${fenv}&faststyle=aetnaConsumer`
  },
  {
    type: 'claims_hist',
    url: `https://${process.env.CVS_WEB_COMPONENT_BASE_URL}/ClaimsHistory/V1.0/#/?apiKey=${process.env.CVS_WEB_COMP_API_KEY}&apiSecret=${process.env.CVS_WEB_COMP_API_SECRET}&fenv=${fenv}&tokenid=${cvsPartnerLoginToken}&faststyle=aetnaConsumer`
  },
  {
    type: 'order_status',
    url: `https://${process.env.CVS_WEB_COMPONENT_BASE_URL}/orderstatus/v1/#/?apiKey=${process.env.CVS_WEB_COMP_API_KEY}&apiSecret=${process.env.CVS_WEB_COMP_API_SECRET}&fenv=${fenv}&tokenid=${cvsPartnerLoginToken}&faststyle=aetnaConsumer`
  },
  {
    type: 'new_rx',
    url: `https://${process.env.CVS_WEB_COMPONENT_BASE_URL}/newrx/v1/#/?apiKey=${process.env.CVS_WEB_COMP_API_KEY}&apiSecret=${process.env.CVS_WEB_COMP_API_SECRET}&fenv=${fenv}&tokenid=${cvsPartnerLoginToken}&faststyle=aetnaConsumer`
  },
  {
    type: 'refill_rx',
    url: `https://${process.env.CVS_WEB_COMPONENT_BASE_URL}/refillfromaccount/1.0/#/?apiKey=${process.env.CVS_WEB_COMP_API_KEY}&apiSecret=${process.env.CVS_WEB_COMP_API_SECRET}&tokenId=${cvsPartnerLoginToken}&fenv=${fenv}&faststyle=aetnaConsumer`
  },
  {
    type: 'set_notifications',
    url: `https://${process.env.CVS_WEB_COMPONENT_BASE_URL}/FASTPbmMemberAccount/1.0/#/memberAlerts?apiKey=${process.env.CVS_WEB_COMP_API_KEY}&apiSecret=${process.env.CVS_WEB_COMP_API_SECRET}&tokenId=${cvsPartnerLoginToken}&fenv=${fenv}&faststyle=aetnaConsumer`
  },
  {
    type: 'plan_accums',
    url: `https://${process.env.CVS_WEB_COMPONENT_BASE_URL}/FASTPlanSummary/v1/#/?apiKey=${process.env.CVS_WEB_COMP_API_KEY}&apiSecret=${process.env.CVS_WEB_COMP_API_SECRET}&fenv=${fenv}&tokenid=${cvsPartnerLoginToken}&faststyle=aetnaConsumer`
  }
];

describe('CVS Partner Login Service', () => {
  describe('componentizer', () => {
    describe('componentize()', () => {

      it('returns a web components object', () => {
        const generatedComponents = componentizer.componentize({cvsPartnerLoginToken});
        expect(JSON.stringify(generatedComponents)).to.eq(JSON.stringify( {cvsAuthResponse: expectedComponents} ));
      });
    });
  });
});


