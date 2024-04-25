const interospectToken = require('./interospectToken'); // assuming interospectToken is defined in a separate file

async function callIntrospections(resultMapTemp, token) {
    try {
        const resultMap = await interospectToken(resultMapTemp, token);

        if (resultMap['active'] && resultMap['active'] !== true) {
            throw new Error(`Invalid token: ${token}`);
        }

        return resultMap;
    } catch (error) {
        throw new Error(error.message);
    }
}
