const { expect } = require('chai');
const sinon = require('sinon');
const { Client } = require('@opensearch-project/opensearch');
const OpenSearchService = require('./OpenSearchService');

describe('OpenSearchService', () => {
    describe('request_opensearch', () => {
        let openSearchService;
        let msearchStub;

        beforeEach(() => {
            // Stub the msearch method of the client
            msearchStub = sinon.stub().resolves({ body: { /* mock response body */ } });

            // Stub the Client constructor to return a stubbed instance
            const clientStub = sinon.stub(Client.prototype, 'msearch').callsFake(msearchStub);

            // Instantiate the OpenSearchService with the client stub
            openSearchService = new OpenSearchService();
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should make a request to OpenSearch and return response body', async () => {
            const indexName = 'testIndex';
            const queryJson = { /* mock query JSON */ };

            // Call the method under test
            const response = await openSearchService.request_opensearch(indexName, queryJson);

            // Verify the behavior
            expect(msearchStub.calledOnce).to.be.true;
            expect(msearchStub.firstCall.args[0]).to.deep.equal({
                index: indexName,
                body: queryJson
            });
            expect(response).to.deep.equal({ /* expected response body */ });
        });

        it('should throw an error if OpenSearch request fails', async () => {
            const indexName = 'testIndex';
            const queryJson = { /* mock query JSON */ };
            const errorMessage = 'Error message from OpenSearch';

            // Stub the msearch method to simulate an error
            msearchStub.rejects(new Error(errorMessage));

            // Ensure that the function throws the expected error
            await expect(openSearchService.request_opensearch(indexName, queryJson)).to.be.rejectedWith(errorMessage);
        });
    });
});

