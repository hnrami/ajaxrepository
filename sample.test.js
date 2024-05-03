const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const { JWK, JWKS } = require('jose');
const { parse: parseURL } = require('url');

async function verifyOnLocal(token, resultMapTemp) {
    try {
        // Decode the JWT token
        const decodedJwt = jwt.decode(token, { complete: true });

        // Create a map to store claims
        const claimMap = {};

        // Get the keyset URI from resultMapTemp
        const keysetUri = resultMapTemp['keyset-uri'];

        // Parse the keyset URI to extract the hostname and path
        const { hostname, pathname } = parseURL(keysetUri);

        // Construct the JWKS URL (JWK Set URL)
        const jwksURL = {
            host: hostname,
            path: pathname
        };

        // Fetch the JWK Set (JSON Web Key Set) from the JWKS URL
        const jwks = await JWKS.asKeyStore(JWKS.asKeyStoreRequest(jwksURL).fetch());

        // Find the JWK corresponding to the key ID from the JWT token
        const jwk = jwks.get(decodedJwt.header.kid);

        // Convert the JWK to PEM format for verification
        const pem = jwkToPem(jwk.toPEM());

        // Verify the JWT token using the PEM public key
        jwt.verify(token, pem);

        // Decode the claims from the token
        const claims = jwt.decode(token);

        // If the 'exp' claim is an integer, convert it to a BigInt
        if (typeof claims.exp === 'number') {
            claims.exp = BigInt(claims.exp);
        }

        // Add the 'access_token' key to the claims object
        claims['access_token'] = token;

        // Return the claims object
        return claims;
    } catch (error) {
        // Handle errors
        throw new Error(error.message); // or handle the error as required
    }
}
