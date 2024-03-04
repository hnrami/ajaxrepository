const { expect } = require('chai');
const sinon = require('sinon');
const RequestTransformationService = require('./RequestTransformationService');

describe('RequestTransformationService', () => {
    describe('calcculateoffset', () => {
        it('should calculate the offset correctly', async () => {
            const requestTransformationService = new RequestTransformationService();
            const offset = await requestTransformationService.calcculateoffset(2, 10);
            expect(offset).to.equal(10);
        });

        it('should set offset to 0 if pageNumber is undefined or 0', async () => {
            const requestTransformationService = new RequestTransformationService();
            let offset = await requestTransformationService.calcculateoffset(undefined, 10);
            expect(offset).to.equal(0);

            offset = await requestTransformationService.calcculateoffset(0, 10);
            expect(offset).to.equal(0);
        });
    });

    describe('formSearchFields', () => {
        it('should return an array of keys from the given JSON string', async () => {
            const requestTransformationService = new RequestTransformationService();
            const fieldsJson = '{"key1": "value1", "key2": "value2"}';
            const keys = await requestTransformationService.formSearchFields(fieldsJson);
            expect(keys).to.deep.equal(['key1', 'key2']);
        });
    });

    describe('validateRquestFields', () => {
        it('should validate request fields correctly', async () => {
            const requestTransformationService = new RequestTransformationService();
            const request = {
                pageSize: '10',
                pageNumber: '2',
                SEARCH_STRIGNS: 'search string'
            };
            const validationResult = await requestTransformationService.validateRquestFields(request);
            expect(validationResult).to.deep.equal({
                validPagesize: true,
                validPageNumber: true,
                mandatoryKeys: ['SEARCH_STRIGNS'],
                optionalkeys: ['pageSize', 'pageNumber']
            });
        });
    });
});
