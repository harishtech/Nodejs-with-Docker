const axios = require('axios');
const { logRequest, logResponse } = require('../logger');

const axiosWithLogging = axios.create();

axiosWithLogging.interceptors.request.use(request => {
  logRequest(request, 'REQ::AXIOS MIDDLEWARE');

  return request;
});

axiosWithLogging.interceptors.response.use(response => {
  logResponse(response, 'RES::AXIOS MIDDLEWARE');

  return response;
});

module.exports = axiosWithLogging;
