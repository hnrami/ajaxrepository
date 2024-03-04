
const { expect } = require('chai');
const ResponseTransformationService = require('./ResponseTransformationService');

describe('ResponseTransformationService', () => {
    describe('aggregteIndexResposne', () => {
        it('should aggregate index responses correctly', async () => {
            const responseTransformationService = new ResponseTransformationService();
            const input1 = { data: [{ key1: ['value1', 'value2'] }] };
            const input2 = { data: [{ key2: ['value3', 'value4'] }] };

            const output = await responseTransformationService.aggregteIndexResposne(input1, input2);

            // Add your assertions for the expected output here
        });
    });

    describe('checksizejson', () => {
        it('should return default data if inputjson is null or empty', async () => {
            const responseTransformationService = new ResponseTransformationService();
            const inputJson = null;

            const output = await responseTransformationService.checksizejson(inputJson);

            // Add your assertions for the expected output here
        });

        it('should return the inputjson if it is not null or empty', async () => {
            const responseTransformationService = new ResponseTransformationService();
            const inputJson = [{/* your input JSON */}];

            const output = await responseTransformationService.checksizejson(inputJson);

            // Add your assertions for the expected output here
        });
    });

    describe('convertDataResponses', () => {
        it('should convert data responses from API response', async () => {
            const responseTransformationService = new ResponseTransformationService();
            const apiResponse = {/* mock API response */};

            const output = await responseTransformationService.convertDataResponses(apiResponse);

            // Add your assertions for the expected output here
        });
    });
});
