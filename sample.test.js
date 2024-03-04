const { expect } = require('chai');
const sinon = require('sinon');
const AutoComplateService = require('./AutoComplateService');

describe('AutoComplateService', () => {
    describe('searchAutoComplateAPi', () => {
        it('should return success response when request fields are valid', async () => {
            // Setup mocks or stubs for dependencies and required objects
            const mockReq = {
                query: {
                    SEARCH_STRING: 'test',
                    PAGE_SIZE: 10
                    // Add other required query parameters
                }
            };

            const mockRequestTransformationService = {
                validateREquestFields: sinon.stub().resolves({
                    mandatoryKeys: [constants.SEARCH_STRING],
                    validPageSize: true,
                    validPageNumber: true
                })
            };

            const mockResponseTransformationService = {
                aggregateindexrepsone: sinon.stub().resolves(/* mock aggregate response */)
            };

            const mockOpenSearchService = {
                request_openSearch: sinon.stub().resolves(/* mock OpenSearch response */)
            };

            const autoComplateService = new AutoComplateService({
                requestTransformationService: mockRequestTransformationService,
                responseTransformationService: mockResponseTransformationService,
                openSearchService: mockOpenSearchService
                // Add other dependencies
            });

            const response = await autoComplateService.searchAutoComplateAPi(mockReq);

            // Add assertions to verify the response
        });

        // Add more test cases for different scenarios
    });

    describe('openSearchCommonIndex', () => {
        it('should return response from OpenSearch service', async () => {
            // Setup mocks or stubs for dependencies and required objects
            const autoComplateService = new AutoComplateService(/* initialize with dependencies */);

            // Call the method and validate the response
            const response = await autoComplateService.openSearchCommonIndex(/* provide required parameters */);

            // Add assertions to verify the response
        });

        // Add more test cases for different scenarios
    });

    // Add more test cases for other methods if necessary
});
