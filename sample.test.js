const { expect } = require('chai');
const sinon = require('sinon');

// Import the function to be tested
const { introspectToken } = require('./yourFile'); // Update the path accordingly

describe('introspectToken', () => {
  it('should return the result when called with valid inputs', async () => {
    // Stub the required methods and values
    const resultMapTemp = new Map([
      [constants.CLIENT_ID, 'yourClientId'],
      [constants.CLIENT_SECRET, 'yourClientSecret'],
      [constants.INTROSPECT_TOKEN_URL, 'yourIntrospectTokenUrl']
    ]);
    const accessToken = 'validAccessToken';
    const expectedResult = 'expectedResult';
    
    const getAuthorizationHeaderStub = sinon.stub().resolves('validAuthorizationHeader');
    const postForMappingStub = sinon.stub().resolves(expectedResult);
    
    const fakeThis = {
      getAuthorizationHeader: getAuthorizationHeaderStub,
      postForMapping: postForMappingStub
    };

    // Call the function
    const result = await introspectToken.call(fakeThis, resultMapTemp, accessToken);

    // Assertions
    expect(getAuthorizationHeaderStub.calledOnceWith('yourClientId', 'yourClientSecret')).to.be.true;
    expect(postForMappingStub.calledOnceWith('yourIntrospectTokenUrl', sinon.match.any, { 'Authorization': 'validAuthorizationHeader' })).to.be.true;
    expect(result).to.equal(expectedResult);
  });

  it('should throw an error when an error occurs', async () => {
    // Stub the required methods to throw an error
    const resultMapTemp = new Map([
      [constants.CLIENT_ID, 'yourClientId'],
      [constants.CLIENT_SECRET, 'yourClientSecret'],
      [constants.INTROSPECT_TOKEN_URL, 'yourIntrospectTokenUrl']
    ]);
    const accessToken = 'validAccessToken';
    const errorMessage = 'An error occurred';

    const getAuthorizationHeaderStub = sinon.stub().rejects(new Error(errorMessage));
    const postForMappingStub = sinon.stub();

    const fakeThis = {
      getAuthorizationHeader: getAuthorizationHeaderStub,
      postForMapping: postForMappingStub
    };

    // Call the function and assert that it throws an error
    await expect(introspectToken.call(fakeThis, resultMapTemp, accessToken)).to.be.rejectedWith(Error, errorMessage);

    // Assertions
    expect(getAuthorizationHeaderStub.calledOnceWith('yourClientId', 'yourClientSecret')).to.be.true;
    expect(postForMappingStub.notCalled).to.be.true; // Ensure that postForMapping is not called
  });
});
