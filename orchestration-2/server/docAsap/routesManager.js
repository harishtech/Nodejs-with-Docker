const routes = [
  {
    route: '/docasap/v1/Providers/v1/GetProviderStatus',
    endpoint: process.env.DOCASAP_URL+'/Providers/v1/GetProviderStatus'
  },
  {
    route: '/docasap/v1/Providers/v1/GetProviderLocations',
    endpoint: process.env.DOCASAP_URL+'/Providers/v1/GetProviderLocations'
  },
  {
    route: '/docasap/v1/Providers/v1/GetProviderTopVisitReasons',
    endpoint: process.env.DOCASAP_URL+'/Providers/v1/GetProviderTopVisitReasons'
  },
  {
    route: '/docasap/v1/Providers/v1/GetProviderReasonSchedule',
    endpoint: process.env.DOCASAP_URL+'/Providers/v1/GetProviderReasonSchedule'
  },
  {
    route: '/docasap/v1/Providers/v1/GetProviderReasonScheduleWorkflowNext',
    endpoint: process.env.DOCASAP_URL+'/Providers/v1/GetProviderReasonScheduleWorkflowNext'
  },
  {
    route: '/docasap/v1/Providers/v1/GetProviderOperationalQuestions',
    endpoint: process.env.DOCASAP_URL+'/Providers/v1/GetProviderOperationalQuestions'
  },
  {
    route: '/docasap/v1/Providers/v1/BookAppointment',
    endpoint: process.env.DOCASAP_URL+'/Providers/v1/BookAppointment'
  }
];

function getAllRoutes() {
  return routes.map(r => r.route);
}

function fetchEndpoint(route) {
  const result = routes.find(r => (r.route == route));

  return result.endpoint;
}

module.exports = {
  getAllRoutes,
  fetchEndpoint
};
