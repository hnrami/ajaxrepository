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
            sinon.stub(Client.prototype, 'msearch').callsFake(msearchStub);

            // Instantiate the OpenSearchService with the client stub
            openSearchService = new OpenSearchService();

            // Ensure that the Client is properly configured with the node option
            openSearchService.openSearchService = new Client({
                node: 'http://localhost:9200' // Set the node option to your OpenSearch server's URL
                // Add other necessary options here
            });
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

        // Other test cases...
    });
});
