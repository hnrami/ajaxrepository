const { expect } = require('chai');
const sinon = require('sinon');
const axios = require('axios');

// Import the function to be tested
const { postMapping } = require('./yourFile'); // Update the path accordingly

describe('postMapping', () => {
  it('should return the result when called with valid inputs and successful HTTP POST request', async () => {
    // Define inputs
    const path = 'yourPostEndpoint';
    const formData = { key: 'value' };
    const headers = { 'Authorization': 'Bearer yourAccessToken' };
    const expectedResult = { active: true };

    // Stub axios.post to resolve with expectedResult
    const axiosPostStub = sinon.stub(axios, 'post').resolves({ data: expectedResult });

    // Call the function
    const result = await postMapping(path, formData, headers);

    // Assertions
    expect(axiosPostStub.calledOnceWith(path, formData, { headers })).to.be.true;
    expect(result).to.deep.equal(expectedResult);

    // Restore the stubbed method
    axiosPostStub.restore();
  });

  it('should throw an error when an error occurs during the HTTP POST request', async () => {
    // Define inputs
    const path = 'yourPostEndpoint';
    const formData = { key: 'value' };
    const headers = { 'Authorization': 'Bearer yourAccessToken' };
    const errorMessage = 'An error occurred during HTTP POST request';

    // Stub axios.post to reject with an error
    const axiosPostStub = sinon.stub(axios, 'post').rejects(new Error(errorMessage));

    // Call the function and assert that it throws an error
    await expect(postMapping(path, formData, headers)).to.be.rejectedWith(Error, errorMessage);

    // Assertions
    expect(axiosPostStub.calledOnceWith(path, formData, { headers })).to.be.true;

    // Restore the stubbed method
    axiosPostStub.restore();
  });
});
