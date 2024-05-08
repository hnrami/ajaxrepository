const { expect } = require('chai');
const sinon = require('sinon');

// Import the function to be tested
const { postMapping } = require('./yourFile'); // Update the path accordingly

describe('postMapping', () => {
  it('should return the result when called with valid inputs and successful HTTP POST request', async () => {
    // Define inputs
    const path = 'yourPostEndpoint';
    const formData = { key: 'value' };
    const headers = { 'Authorization': 'Bearer yourAccessToken' };
    const expectedResult = { active: true };

    // Stub the axios.post method to simulate a successful HTTP POST request
    const axiosPostStub = sinon.stub().resolves({ data: expectedResult });

    // Call the function
    const result = await postMapping(path, formData, headers, axiosPostStub);

    // Assertions
    expect(axiosPostStub.calledOnceWith(path, formData, { headers })).to.be.true;
    expect(result).to.deep.equal(expectedResult);
  });

  it('should throw an error when an error occurs during the HTTP POST request', async () => {
    // Define inputs
    const path = 'yourPostEndpoint';
    const formData = { key: 'value' };
    const headers = { 'Authorization': 'Bearer yourAccessToken' };
    const errorMessage = 'An error occurred during HTTP POST request';

    // Stub the axios.post method to simulate an error during the HTTP POST request
    const axiosPostStub = sinon.stub().rejects(new Error(errorMessage));

    // Call the function and assert that it throws an error
    await expect(postMapping(path, formData, headers, axiosPostStub)).to.be.rejectedWith(Error, errorMessage);

    // Assertions
    expect(axiosPostStub.calledOnceWith(path, formData, { headers })).to.be.true;
  });

  it('should throw an error when the response does not contain the expected data structure', async () => {
    // Define inputs
    const path = 'yourPostEndpoint';
    const formData = { key: 'value' };
    const headers = { 'Authorization': 'Bearer yourAccessToken' };
    const invalidResponse = { invalidKey: 'invalidValue' };

    // Stub the axios.post method to simulate a successful HTTP POST request with an invalid response
    const axiosPostStub = sinon.stub().resolves({ data: invalidResponse });

    // Call the function and assert that it throws an error
    await expect(postMapping(path, formData, headers, axiosPostStub)).to.be.rejectedWith(Error, 'Invalid response data structure');

    // Assertions
    expect(axiosPostStub.calledOnceWith(path, formData, { headers })).to.be.true;
  });
});
