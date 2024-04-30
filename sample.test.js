const TokenAuthenticate = require('../path/to/TokenAuthenticate');
const { CONFIGURATIONS } = require('../config/config');
const constants = require("../constants/constants");

// Mocking the dependencies
const configMock = new Map([
  ['tokenIssuer1', { [constants.KEYSETURI]: 'someUri1' }],
  ['tokenIssuer2', { [constants.KEYSETURI]: null }]
]);

jest.mock('../config/config', () => ({
  CONFIGURATIONS: configMock
}));

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

      tokenAuthenticate.verifyOnLocal = jest.fn().mockResolvedValue(expectedResult);

      const result = await tokenAuthenticate.introspectToken(token, tokenIssuer);

      expect(result).toBe(expectedResult);
      expect(tokenAuthenticate.verifyOnLocal).toHaveBeenCalledWith(token, configMock.get(tokenIssuer));
    });

    it('should call callIntrospections if KEYSETURI is null', async () => {
      const token = 'sampleToken';
      const tokenIssuer = 'tokenIssuer2';
      const expectedResult = 'result';

      tokenAuthenticate.callIntrospections = jest.fn().mockResolvedValue(expectedResult);

      const result = await tokenAuthenticate.introspectToken(token, tokenIssuer);

      expect(result).toBe(expectedResult);
      expect(tokenAuthenticate.callIntrospections).toHaveBeenCalledWith(configMock.get(tokenIssuer), token);
    });

    it('should throw an error if any exception occurs', async () => {
      const token = 'sampleToken';
      const tokenIssuer = 'tokenIssuer3';
      const errorMessage = 'An error occurred';

      tokenAuthenticate.getTokenExchangeDetailsTemp = jest.fn().mockRejectedValue(new Error(errorMessage));

      await expect(tokenAuthenticate.introspectToken(token, tokenIssuer)).rejects.toThrow(errorMessage);
    });
  });
});
