function getTokenExchangeDetailsTemp(tokenExchangeConfig) {
    let configMaps = new Map();

    try {
        let jobject = JSON.parse(tokenExchangeConfig);
        let jArray = jobject["toekn-issue"]; // Fix the typo in "token-issue"

        for (let i = 0; i < jArray.length; i++) {
            let jobject = jArray[i];

            if (jobject["exchange-token"] === null) {
                let exchangedMapDetails = new Map();
                exchangedMapDetails.set("sample", ""); // Assuming you wanted to put a string value here

                configMaps.set("sample", exchangedMapDetails);
            }
        }
    } catch (e) {
        // Handle the exception
    }
}

