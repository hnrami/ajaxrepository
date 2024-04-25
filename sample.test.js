function getAuthorizationHeader(clientID, clientSecret) {
    if (!clientID || !clientSecret) {
        log.warn('NULL ClientID');
    }

    const creds = `${clientID}:${clientSecret}`;
    try {
        return 'Basic ' + Buffer.from(creds, 'utf-8').toString('base64');
    } catch (error) {
        throw new Error('Could not convert string');
    }
}


const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const axios = require('axios');

async function verifyOnLocal(token, resultMapTemp) {
    try {
        const decodedJwt = jwt.decode(token, { complete: true });

        const myURL = new URL(resultMapTemp['keyset-uri']);
        const { data: jwkSet } = await axios.get(myURL);

        const jwk = jwkSet.keys.find(key => key.kid === decodedJwt.header.kid);
        if (!jwk) {
            throw new Error('Key not found');
        }

        const pem = jwkToPem(jwk);
        jwt.verify(token, pem);

        let claimMap = jwt.decode(token, { complete: false });

        if (claimMap.exp && typeof claimMap.exp === 'number') {
            claimMap.exp = new Date(claimMap.exp * 1000);
        }

        claimMap['access_token'] = token;

        if (new Date(claimMap.exp) < new Date()) {
            throw new Error('Expired token!');
        }

        return claimMap;
    } catch (error) {
        throw new Error(error.message);
    }
}





