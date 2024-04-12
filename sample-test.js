describe('WellService', function() {
  let mockSearchService, mockRequestTransformationService, mockResponseTransformationService, wellService, mockReq;

  beforeEach(function() {
    // Initialize stubs and mocks
    mockSearchService = {
      request_well: sinon.stub()
    };
    mockRequestTransformationService = {
      validatewellREquestFields: sinon.stub()
    };
    mockResponseTransformationService = {
      aggregateWellResponse: sinon.stub()
    };

    wellService = new WellService({
      searchService: mockSearchService,
      requestTransformationService: mockRequestTransformationService,
      responseTransformationServicce: mockResponseTransformationService
    });

    mockReq = {
      query: {
        search_field: 'oil',
        pageSize_field: 10,
        pageNumber_field: 1
      }
    };

    // Configure the stub for multiple calls
    mockSearchService.request_well.callsFake(function() {
      switch (mockSearchService.request_well.callCount) {
        case 1:
          return Promise.resolve('response1');
        case 2:
          return Promise.resolve('response2');
        default:
          return Promise.reject(new Error('Unexpected call'));
      }
    });
  });

  describe('wellAPi', function() {
    it('should return a successful response object when all goes well', async function() {
      mockRequestTransformationService.validatewellREquestFields.resolves({
        search_field: 'oil',
        pageSize_field: 10,
        pageNumber_field: 1
      });

      mockResponseTransformationService.aggregateWellResponse.resolves('aggregated response');

      const response = await wellService.wellAPi(mockReq);

      expect(response).to.eql(new ResponseObj(constants.SCUCCESS, 'aggregated response'));
      expect(mockSearchService.request_well).to.have.been.calledTwice;
    });
  });
});

