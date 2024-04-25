const getIntrospectConfigurations = require('./getIntrospectConfigurations'); // Assuming getIntrospectConfigurations is defined in a separate file
const verfiyOnLocal = require('./verfiyOnLocal'); // Assuming verfiyOnLocal is defined in a separate file
const callIntrospections = require('./callIntrospections'); // Assuming callIntrospections is defined in a separate file

async function introspectToken(token, tokenIssuer) {
    let resultMap = {};
    let resultMapTemp = {};

    const configMaps = getIntrospectConfigurations();
    resultMapTemp = configMaps[tokenIssuer];

    if (resultMapTemp['keyset-uri'] !== null) {
        return await verfiyOnLocal(token, resultMapTemp);
    }

    resultMap = await callIntrospections(resultMapTemp, token);

    return resultMap;
}
