async function postForMapping(path, formData, headers) {
    if (!headers.hasOwnProperty('contentType')) {
        headers['contentType'] = 'application/x-www-form-urlencoded';
    }

    try {
        const response = await axios.post(path, formData, {
            headers: headers
        });
        const map = response.data;

        if (map && map.hasOwnProperty('active') && map['active'] !== true) {
            throw new InvalidTokenException(path);
        }

        return map;
    } catch (error) {
        // Handle the exception
    }
}
