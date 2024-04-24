function getTokenExchangeDetailsTemp(tokenExchangeConfig) {
    let configMaps = new Map();

    try {
        let jobject = JSON.parse(tokenExchangeConfig);
        let jArray = jobject["toekn-issue"]; // Fix the typo in "token-issue"

        for (let i = 0; i < jArray.length; i++) {
            let jobject = jArray[i];

            if (jobject["exchange-token"] === null) {
                let exchangedMapDetails = new Map();

                if (jobject["introspectURL"] !== null) {
                    exchangedMapDetails.set("sample", jobject["clientID"]);
                    configMaps.set("sample", exchangedMapDetails);
                } else {
                    let exchangedMapDetails = new Map();
                    exchangedMapDetails.set("sample", jobject["iss"]);
                    configMaps.set(jobject["test"], exchangedMapDetails);
                }
            }
        }
    } catch (e) {
        // Handle the exception
    }
}
