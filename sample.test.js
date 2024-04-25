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
