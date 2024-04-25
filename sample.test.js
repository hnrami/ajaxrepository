const axios = require('axios');

async function interospectToken(resultMapTemp, accessToken) {
    const formData = new URLSearchParams();
    formData.append('tokenName', accessToken);

    const headers = {
        'Authorization': getAuthorizationHeader(resultMapTemp.get('clinetID'), resultMapTemp.get('client_secert'))
    };

    return await postForMapping(resultMapTemp.get('introspectURL'), formData, headers);
}
