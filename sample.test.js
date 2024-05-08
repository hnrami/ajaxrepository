const { expect } = require('chai');
const sinon = require('sinon');

// Import the function to be tested
const { callIntrospections } = require('./yourFile'); // Update the path accordingly

describe('callIntrospections', () => {
  it('should return the result when called with valid inputs and successful API call', async () => {
    // Define inputs
    const resultMapTemp = { key: 'value' };
    const token = 'validToken';
    const expectedResult = { active: true };

    // Stub interospecttoken to resolve with expectedResult
    const interospectTokenStub = sinon.stub().resolves(expectedResult);

    // Create a fake context with the stubbed interospecttoken
    const fakeThis = { interospecttoken: interospectTokenStub };

    // Call the function
    const result = await callIntrospections.call(fakeThis, resultMapTemp, token);

    // Assertions
    expect(interospectTokenStub.calledOnceWith(resultMapTemp, token)).to.be.true;
    expect(result).to.deep.equal(expectedResult);
  });

  it('should throw an error when an error occurs during the API call', async () => {
    // Define inputs
    const resultMapTemp = { key: 'value' };
    const token = 'validToken';
    const errorMessage = 'An error occurred during API call';

    // Stub interospecttoken to reject with an error
    const interospectTokenStub = sinon.stub().rejects(new Error(errorMessage));

    // Create a fake context with the stubbed interospecttoken
    const fakeThis = { interospecttoken: interospectTokenStub };

    // Call the function and assert that it throws an error
    await expect(callIntrospections.call(fakeThis, resultMapTemp, token)).to.be.rejectedWith(Error, errorMessage);

    // Assertions
    expect(interospectTokenStub.calledOnceWith(resultMapTemp, token)).to.be.true;
  });
});
