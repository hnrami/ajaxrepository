const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { promisify } = require('util');

async function verifyOnLocal(token, resultMapTemp) {
    try {
        // Decode the JWT token
        const decodedJwt = jwt.decode(token, { complete: true });

        // Create a map to store claims
        const claimMap = {};

        // Get the keyset URI from the resultMapTemp
        const keysetUri = resultMapTemp['keyset-uri'];

        // Create a new JWKS (JSON Web Key Set) client instance
        const client = jwksClient({
            jwksUri: keysetUri
        });

        // Promisify the client.getSigningKey function
        const getSigningKeyAsync = promisify(client.getSigningKey).bind(client);

        // Get the key ID from the decoded JWT
        const kid = decodedJwt.header.kid;

        // Retrieve the JWK (JSON Web Key) using the key ID
        const getKey = async () => {
            const key = await getSigningKeyAsync(kid);
            return key.getPublicKey();
        };

        // Verify the JWT token using the RSA public key fetched from the JWK
        const decoded = jwt.verify(token, await getKey(), {
            algorithms: ['RS256']
        });

        // Parse the claims from the token
        for (const [key, value] of Object.entries(decoded)) {
            claimMap[key] = value;
        }

        // If the claimMap contains the 'exp' claim and its value is a number, convert it to a BigInt
        if (claimMap.hasOwnProperty('exp') && typeof claimMap['exp'] === 'number') {
            claimMap['exp'] = BigInt(claimMap['exp']);
        }

        // Add the 'access_token' key to the claimMap with the token value
        claimMap['access_token'] = token;

        // Return the claimMap containing the decoded claims from the token
        return claimMap;
    } catch (error) {
        // Handle exceptions
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
