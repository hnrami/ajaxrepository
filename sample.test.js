describe('constructor', () => {
  it('should create a new instance of Client with correct options', () => {
    // Stub process.env values for testing
    const originalEnv = { ...process.env };
    process.env.HOST_URL = 'https://example.com';
    process.env.USER = 'testuser';
    process.env.PASSWORD = 'testpassword';

    // Stub the Client constructor
    const clientStub = sinon.stub(Client.prototype, 'constructor');

    // Create an instance of SearchService
    const searchService = new SearchService();

    // Assert that Client constructor was called with the correct options
    expect(clientStub).to.have.been.calledOnce; // Use Chai's chai-as-promised plugin for better readability
    expect(clientStub.firstCall.args[0]).to.deep.equal({
      ssl: { rejectUnauthorized: false },
      node: 'https://example.com',
      auth: { username: 'testuser', password: 'testpassword' },
      headers: { 'Content-Type': 'application/json' }
    });

    // Restore process.env values
    process.env = { ...originalEnv };
  });
});
