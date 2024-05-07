const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

async function verifyOnLocal(token, resultMapTemp) {
    try {
        const decodedJwt = jwt.decode(token, { complete: true });
        const claimMap = {};
        const keysetUri = resultMapTemp['keyset-uri'];
        const client = jwksClient({ jwksUri: keysetUri });
        const kid = decodedJwt.header.kid;

        const getKey = async () => {
            return new Promise((resolve, reject) => {
                client.getSigningKey(kid, (err, key) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(key.getPublicKey());
                    }
                });
            });
        };

        const publicKey = await getKey();
        const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });

        for (const [key, value] of Object.entries(decoded)) {
            claimMap[key] = value;
        }

        if (claimMap.hasOwnProperty('exp') && typeof claimMap['exp'] === 'number') {
            claimMap['exp'] = BigInt(claimMap['exp']);
        }

        claimMap['access_token'] = token;

        return claimMap;
    } catch (error) {
        throw new Error(`Error verifying token: ${error.message}`);
    }
}

// Example usage:
const token = 'YOUR_JWT_TOKEN_HERE';
const resultMapTemp = {
    'keyset-uri': 'YOUR_KEYSET_URI_HERE'
};

verifyOnLocal(token, resultMapTemp)
    .then(claimMap => {
        console.log('Decoded claims:', claimMap);
    })
    .catch(error => {
        console.error('Error:', error.message);
    });
