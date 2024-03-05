const { expect } = require('chai');
const sinon = require('sinon');
const { Client } = require('@opensearch-project/opensearch');

const OpenSearchService = require('../path/to/OpenSearchService');

describe('OpenSearchService', () => {
    describe('Constructor', () => {
        it('should initialize the OpenSearchService with correct configurations', () => {
            // Mock the dynamic properties
            const OPENSEARCH_HOST_URL = 'http://example.com';
            const OPENSEARCH_USERNAME = 'username';
            const OPENSEARCH_PASSWORD = 'password';

            // Stub the constructor of the Client class
            const clientStub = sinon.stub(Client.prototype, 'constructor');

            // Create an instance of the OpenSearchService
            const openSearchService = new OpenSearchService();

            // Expectations
            expect(clientStub.calledOnce).to.be.true;
            expect(clientStub.calledWithExactly({
                node: OPENSEARCH_HOST_URL,
                auth: {
                    username: OPENSEARCH_USERNAME,
                    password: OPENSEARCH_PASSWORD
                }
            })).to.be.true;

            // Restore the stub
            clientStub.restore();
        });
    });
});

