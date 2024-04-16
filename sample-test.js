const sinon = require('sinon');
const { expect } = require('chai');
const WellService = require('../path/to/WellService');
const ResponseObj = require('../path/to/apirepsone');
const constants = require('../path/to/constants');

// Mocks for services used by WellService
const mockSearchService = {
    request_well: sinon.stub()
};
const mockRequestTransformationService = {
    validatewellREquestFields: sinon.stub()
};
const mockResponseTransformationService = {
    aggregateWellResponse: sinon.stub()
};

// Create an instance of WellService with mocks
const wellService = new WellService({
    searchService: mockSearchService,
    requestTransformationService: mockRequestTransformationService,
    responseTransformationServicce: mockResponseTransformationService
});

describe('WellService', function() {
    afterEach(function() {
        // Reset the stubs after each test
        sinon.reset();
    });

    describe('wellAPi', function() {
        it('should handle valid inputs and return a successful response', async function() {
            // Setup the expected behavior of the stubs
            mockRequestTransformationService.validatewellREquestFields.resolves({
                search_field: "oil", pageSize_field: 10, pageNumber_field: 1
            });
            mockSearchService.request_well.onFirstCall().resolves({ data: ['data1'] });
            mockSearchService.request_well.onSecondCall().resolves({ data: ['data2'] });
            mockResponseTransformationService.aggregateWellResponse.resolves({
                data: ['data1', 'data2'], message: "success"
            });
            sinon.stub(ResponseObj, 'constructor').returns({ status: constants.SUCCESS, data: ['data1', 'data2'] });

            const req = { query: { search_String: "oil", pageSize: 10, pageNumber: 1 } };

            const result = await wellService.wellAPi(req);

            // Assertions to check if the method behaves as expected
            expect(result).to.deep.include({ status: constants.SUCCESS, data: ['data1', 'data2'] });
            sinon.assert.calledOnce(mockRequestTransformationService.validatewellREquestFields);
            sinon.assert.calledTwice(mockSearchService.request_well);
            sinon.assert.calledOnce(mockResponseTransformationService.aggregateWellResponse);
        });

        it('should handle errors gracefully', async function() {
            // Configure the request transformation service to throw an error
            mockRequestTransformationService.validatewellREquestFields.rejects(new Error("Validation failed"));

            const req = { query: { search_String: "oil", pageSize: 10, pageNumber: 1 } };

            // Execute
            const result = await wellService.wellAPi(req);

            // Check that an error response object is returned
            expect(result).to.be.an.instanceOf(ResponseObj);  // Assuming ResponseObj can represent errors
            expect(result.status).to.equal("error");
            sinon.assert.calledOnce(mockRequestTransformationService.validatewellREquestFields);
            sinon.assert.notCalled(mockSearchService.request_well);  // This should not be called due to earlier failure
        });
    });
});
