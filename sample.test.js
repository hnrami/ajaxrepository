async function convert(apiResponse) {
    const queryResponse = apiResponse.response;
    const responseJson = {
        "data": [],
        "fieldwithcountry": []
    };

    // Process each response
    for (const response of queryResponse) {
        await processResponse(response, responseJson);
    }

    return responseJson;
}

async function processResponse(response, responseJson) {
    for (const key in response.aggregations) {
        if (Object.prototype.hasOwnProperty.call(response.aggregations, key)) {
            const buckets = response.aggregations[key].buckets;
            if (buckets && buckets.length > 0) {
                await processBuckets(buckets, key, responseJson);
            }
        }
    }
}

async function processBuckets(buckets, key, responseJson) {
    for (const bucket of buckets) {
        if (bucket.commonfields.hits.hits.length > 0) {
            const data = [];
            const fieldwithcountry = [];

            await processBucketHits(bucket, data, fieldwithcountry);

            if (data.length > 0)
                responseJson.data.push({ [key]: data });
            if (fieldwithcountry.length > 0)
                responseJson.fieldwithcountry.push({ [key]: fieldwithcountry });
        }
    }
}

async function processBucketHits(bucket, data, fieldwithcountry) {
    for (const record of bucket.commonfields.hits.hits) {
        const { recordgeopolitical, fieldvalue } = await processRecord(record);

        if (fieldvalue !== null && fieldvalue !== undefined)
            fieldwithcountry.push(`{${fieldvalue},recordgeopolitical=${recordgeopolitical}}`);
        else
            fieldwithcountry.push(`{recordgeopolitical=${recordgeopolitical}}`);

        if (bucket.key) {
            data.push(bucket.key);
        }
    }
}

async function processRecord(record) {
    let fieldvalue;
    let recordgeopolitical;

    for (const recordValue in record._source) {
        if (Object.prototype.hasOwnProperty.call(record._source, recordValue)) {
            const value = record._source[recordValue];
            if (recordValue === 'recordgeopolitical')
                recordgeopolitical = value;
            else
                fieldvalue = recordValue + "=" + value;
        }
    }

    return { recordgeopolitical, fieldvalue };
}

module.exports = { convert };

