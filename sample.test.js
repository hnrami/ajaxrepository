const { CONFIGURATIONS } = require('../config/config');
const constants = require("../constants/constants");
const TokenAuthenticate = require('../path/to/TokenAuthenticate');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

// Use chai-as-promised plugin
chai.use(chaiAsPromised);

// Assertion style
const expect = chai.expect;

// Mocking the dependencies
const configMock = new Map([
  ['tokenIssuer1', { [constants.KEYSETURI]: 'someUri1' }],
  ['tokenIssuer2', { [constants.KEYSETURI]: null }]
]);

describe('TokenAuthenticate', () => {
  let tokenAuthenticate;

  beforeEach(() => {
    tokenAuthenticate = new TokenAuthenticate();
  });

  describe('introspectToken', () => {
    it('should call verifyOnLocal if KEYSETURI is not null', async () => {
      const token = 'sampleToken';
      const tokenIssuer = 'tokenIssuer1';
      const expectedResult = 'result';

      tokenAuthenticate.verifyOnLocal = async () => expectedResult;

      const result = await tokenAuthenticate.introspectToken(token, tokenIssuer);

      expect(result).to.equal(expectedResult);
    });

    it('should call callIntrospections if KEYSETURI is null', async () => {
      const token = 'sampleToken';
      const tokenIssuer = 'tokenIssuer2';
      const expectedResult = 'result';

      tokenAuthenticate.callIntrospections = async () => expectedResult;

      const result = await tokenAuthenticate.introspectToken(token, tokenIssuer);

      expect(result).to.equal(expectedResult);
    });

    it('should throw an error if any exception occurs', async () => {
      const token = 'sampleToken';
      const tokenIssuer = 'tokenIssuer3';
      const errorMessage = 'An error occurred';

      tokenAuthenticate.getTokenExchangeDetailsTemp = async () => {
        throw new Error(errorMessage);
      };

      await expect(tokenAuthenticate.introspectToken(token, tokenIssuer)).to.be.rejectedWith(errorMessage);
    });
  });
});
