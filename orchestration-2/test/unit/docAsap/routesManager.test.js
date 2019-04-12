require('dotenv').config();
const { expect } = require('chai');

const routesManager = require('./../../../server/docAsap/routesManager');

describe('DocASAP Service', () => {
  describe('routesManager', () => {
    describe('getAllRoutes()', () => {
      it('returns all the local DocASAP routes', () => {
        expect(routesManager.getAllRoutes()).to.include('/docasap/v1/Providers/v1/GetProviderStatus');
        expect(routesManager.getAllRoutes()).to.include('/docasap/v1/Providers/v1/GetProviderLocations');
        expect(routesManager.getAllRoutes()).to.include('/docasap/v1/Providers/v1/GetProviderTopVisitReasons');
        expect(routesManager.getAllRoutes()).to.include('/docasap/v1/Providers/v1/GetProviderReasonSchedule');
        expect(routesManager.getAllRoutes()).to.include('/docasap/v1/Providers/v1/GetProviderReasonScheduleWorkflowNext');
        expect(routesManager.getAllRoutes()).to.include('/docasap/v1/Providers/v1/GetProviderOperationalQuestions');
        expect(routesManager.getAllRoutes()).to.include('/docasap/v1/Providers/v1/BookAppointment');
      });
    });

    describe('fetchEndpoint()', () => {
      it('returns the DocASAP endpoint for the provided route', () => {
        expect(routesManager.fetchEndpoint('/docasap/v1/Providers/v1/GetProviderStatus')).to.equal(process.env.DOCASAP_URL+'/Providers/v1/GetProviderStatus');
        expect(routesManager.fetchEndpoint('/docasap/v1/Providers/v1/GetProviderLocations')).to.equal(process.env.DOCASAP_URL+'/Providers/v1/GetProviderLocations');
        expect(routesManager.fetchEndpoint('/docasap/v1/Providers/v1/GetProviderTopVisitReasons')).to.equal(process.env.DOCASAP_URL+'/Providers/v1/GetProviderTopVisitReasons');
        expect(routesManager.fetchEndpoint('/docasap/v1/Providers/v1/GetProviderReasonSchedule')).to.equal(process.env.DOCASAP_URL+'/Providers/v1/GetProviderReasonSchedule');
        expect(routesManager.fetchEndpoint('/docasap/v1/Providers/v1/GetProviderReasonScheduleWorkflowNext')).to.equal(process.env.DOCASAP_URL+'/Providers/v1/GetProviderReasonScheduleWorkflowNext');
        expect(routesManager.fetchEndpoint('/docasap/v1/Providers/v1/GetProviderOperationalQuestions')).to.equal(process.env.DOCASAP_URL+'/Providers/v1/GetProviderOperationalQuestions');
        expect(routesManager.fetchEndpoint('/docasap/v1/Providers/v1/BookAppointment')).to.equal(process.env.DOCASAP_URL+'/Providers/v1/BookAppointment');
      });
    });
  });
});
