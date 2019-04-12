const { expect } = require('chai');

const axiosWithLogging = require('./../../../../server/utils/axios/axiosWithLogging');

describe('axiosWithLogging', () => {
  describe('interceptors', () => {
    it('returns an axios instance with a custom interceptor that logs requests', () => {
      expect(axiosWithLogging.interceptors.request.handlers[0].fulfilled.toString()).
        to.include('logRequest(request, \'REQ::AXIOS MIDDLEWARE\')');
    });

    it('returns an axios instance with a custom interceptor that logs responses', () => {
      expect(axiosWithLogging.interceptors.response.handlers[0].fulfilled.toString()).
        to.include('logResponse(response, \'RES::AXIOS MIDDLEWARE\')');
    });
  });
});
