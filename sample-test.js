const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

// Assuming WellService is exported and can be required like this:
const { WellService } = require('../path/to/WellService');

describe('WellService', function() {
    let mockSearchService, mockRequestTransformationService, mockResponseTransformationService;
    let wellService;
    let req, constants, ResponseObj;

    beforeEach(function() {
        // Mocking dependencies
        mockSearchService = {
            request_well: sinon.stub()
        };
        mockRequestTransformationService = {
            validatewellREquestFields: sinon.stub()
        };
        mockResponseTransformationService = {
            aggregateWellResponse: sinon.stub()
        };

        constants = { SUCCESS: 'success' };
        ResponseObj = sinon.stub();

        // Create instance of WellService with mocked dependencies
        wellService = new WellService({
            searchService: mockSearchService,
            requestTransformationService: mockRequestTransformationService,
            responseTransformationService: mockResponseTransformationService
        });

        req = {
            query: {
                search: "test",
                pageSize: 10,
                pageNumber: 1
            }
        };
    });

    describe('wellApi method', function() {
        it('should handle search service failure gracefully', async function() {
            // Setup stubs for the test case
            mockRequestTransformationService.validatewellREquestFields.resolves({
                search_field: "test",
                pageSize_field: 10,
                pageNumber_field: 1
            });

            // Here we setup the stub to reject when called
            mockSearchService.request_well.rejects(new Error("Search service failed"));

            // Adjusting response stub setup
            ResponseObj.returns({ status: "error", message: "error while hitting api" });

            const result = await wellService.wellAPi(req);

            expect(result).to.deep.equal({ status: "error", message: "error while hitting api" });
        });
    });
});
