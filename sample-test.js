const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

// Importing the WellService class
const { WellService } = require('../path/to/WellService');

describe('WellService', function() {
    let mockSearchService, mockRequestTransformationService, mockResponseTransformationService;
    let wellService;
    let req, constants, ResponseObj;

    beforeEach(function() {
        // Create mock services
        mockSearchService = {
            request_well: sinon.stub()
        };
        mockRequestTransformationService = {
            validatewellREquestFields: sinon.stub()
        };
        mockResponseTransformationService = {
            aggregateWellResponse: sinon.stub()
        };

        // Constants and Response Object mock
        constants = { SUCCESS: 'success' };
        ResponseObj = sinon.stub();

        // Initialize WellService with mocks
        wellService = new WellService({
            searchService: mockSearchService,
            requestTransformationService: mockRequestTransformationService,
            responseTransformationService: mockResponseTransformationService
        });

        // Mock request object
        req = {
            query: {
                search: "test",
                pageSize: 10,
                pageNumber: 1
            }
        };
    });

    describe('wellApi method', function() {
        it('should call validatewellREquestFields and request_well twice and return success', async function() {
            mockRequestTransformationService.validatewellREquestFields.resolves({
                search_field: "test",
                pageSize_field: 10,
                pageNumber_field: 1
            });

            mockSearchService.request_well.onFirstCall().resolves('firstPageResponse');
            mockSearchService.request_well.onSecondCall().resolves('secondPageResponse');

            mockResponseTransformationService.aggregateWellResponse.resolves('aggregatedResponse');

            ResponseObj.returns({ status: 'success', data: 'aggregatedResponse' });

            const result = await wellService.wellAPi(req);

            sinon.assert.calledWith(mockRequestTransformationService.validatewellREquestFields, req.query);
            sinon.assert.calledTwice(mockSearchService.request_well);
            expect(result).to.deep.equal({ status: 'success', data: 'aggregatedResponse' });
        });

        it('should handle validation failure and return error response', async function() {
            mockRequestTransformationService.validatewellREquestFields.rejects(new Error("Validation failed"));

            const result = await wellService.wellAPi(req);

            expect(result).to.deep.equal(new ResponseObj("error", "error while hitting api"));
        });

        it('should handle search service failure gracefully', async function() {
            mockRequestTransformationService.validatewellREquestFields.resolves({
                search_field: "test",
                pageSize_field: 10,
                pageNumber_field: 1
            });

            mockSearchService.request_well.rejects(new Error("Search service failed"));

            const result = await wellService.wellAPi(req);

            expect(result).to.deep.equal(new ResponseObj("error", "error while hitting api"));
        });
    });
});
