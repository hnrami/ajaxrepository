import { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai from 'chai';

chai.use(sinonChai);

const WellService = require('./WellService'); // Adjust the path as needed
const ResponseObj = require('../apirepsone.js'); // Ensure path and file name correctness
const constants = require('../constants.js');

describe('WellService', function() {
  let mockSearchService, mockRequestTransformationService, mockResponseTransformationService, wellService, mockReq;

  beforeEach(function() {
    // Create mocks for each service
    mockSearchService = {
      request_well: sinon.stub()
    };
    mockRequestTransformationService = {
      validatewellREquestFields: sinon.stub()
    };
    mockResponseTransformationService = {
      aggregateWellResponse: sinon.stub()
    };

    // Initialize the service with mocks
    wellService = new WellService({
      searchService: mockSearchService,
      requestTransformationService: mockRequestTransformationService,
      responseTransformationServicce: mockResponseTransformationService
    });

    // Setup a typical request object
    mockReq = {
      query: {
        search_field: 'oil',
        pageSize_field: 10,
        pageNumber_field: 1
      }
    };
  });

  describe('wellAPi', function() {
    it('should return a successful response object when all goes well', async function() {
      mockRequestTransformationService.validatewellREquestFields.resolves({
        search_field: 'oil',
        pageSize_field: 10,
        pageNumber_field: 1
      });

      mockSearchService.request_well.onCall(0).resolves('response1');
      mockSearchService.request_well.onCall(1).resolves('response2');
      mockResponseTransformationService.aggregateWellResponse.resolves('aggregated response');

      const response = await wellService.wellAPi(mockReq);

      expect(response).to.eql(new ResponseObj(constants.SCUCCESS, 'aggregated response'));
      expect(mockSearchService.request_well).to.have.been.calledTwice;
    });

    it('should handle errors and return an error response', async function() {
      mockRequestTransformationService.validatewellREquestFields.rejects(new Error('Validation failed'));

      const response = await wellService.wellAPi(mockReq);

      expect(response).to.eql(new ResponseObj("error", "error while hitting api"));
      expect(mockSearchService.request_well).not.to.have.been.called;
    });

    // More tests can be added here for different scenarios
  });
});
