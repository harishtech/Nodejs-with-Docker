const componentize = ({cvsPartnerLoginToken}) => {
  let fenv;

  if(process.env.NODE_ENVIRONMENT === 'production') {
    fenv = 'prod';
  } else {
    fenv = process.env.CVS_HOSTNAME.split('-')[0];
  }

  const component = [
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

  return ( {cvsAuthResponse: component} );
};

module.exports = { componentize };
