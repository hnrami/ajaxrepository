const inputone = {
    "data": [
        {
            "filename": "abc.txt",
            "city": "ADI"
        },
        {
            "filename": "xyz.txt",
            "city": "MUM"
        }
    ]
};

const inputtwo = {
    "data": [
        {
            "filename": "wer.txt",
            "city": "BLR"
        },
        {
            "filename": "kjl.txt",
            "city": "pune"
        }
    ]
};

const integrateInputs = async (inputone, inputtwo) => {
    return new Promise((resolve, reject) => {
        try {
            const output = { data: [] };

            // Check if both inputs are in the expected format
            if (Array.isArray(inputone.data) && Array.isArray(inputtwo.data)) {
                // Extract keys from the first input
                const keys = Object.keys(inputone.data[0]);

                // Create a new object for each key
                keys.forEach(key => {
                    const newData = {};
                    newData[key] = inputone.data.map(item => item[key]).concat(inputtwo.data.map(item => item[key]));
                    output.data.push(newData);
                });
            } else {
                throw new Error('Inputs are not in the expected format');
            }

            resolve(output);
        } catch (error) {
            reject(error);
        }
    });
};

// Example usage:
async function main() {
    try {
        const output = await integrateInputs(inputone, inputtwo);
        console.log(JSON.stringify(output, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
