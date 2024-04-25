const base64url = require('base64url');
const { parse } = require('querystring');

function extractTokenIssuer(token) {
    const tokensplit = token.split('.');
    const tokenBody = base64url.decode(tokensplit[1]);
    const tok = JSON.parse(tokenBody);
    const uri = tok.iss;
    console.log('uri', uri);
    return uri;
}
