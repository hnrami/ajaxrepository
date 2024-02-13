const input1 = {
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

const input2 = {
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

const input3 = {
    "data": [
        {
            "filename": "file1.txt",
            "city": "NYC"
        },
        {
            "filename": "file2.txt",
            "city": "LA"
        }
    ]
};

const input4 = {
    "data": [
        {
            "filename": "file3.txt",
            "city": "HYD"
        },
        {
            "filename": "file4.txt",
            "city": "KOCHI"
        }
    ]
};

const input5 = {
    "data": [
        {
            "filename": "file5.txt",
            "city": "GOA"
        },
        {
            "filename": "file6.txt",
            "city": "SU"
        }
    ]
};

const integrateInputs = async (...inputs) => {
    return new Promise((resolve, reject) => {
        try {
            const output = { data: [] };

            // Check if all inputs are in the expected format
            const isValid = inputs.every(input => Array.isArray(input.data));
            if (!isValid) {
                throw new Error('Inputs are not in the expected format');
            }

            // Extract keys from the first input
            const keys = Object.keys(inputs[0].data[0]);

            // Create a new object for each key
            keys.forEach(key => {
                const newData = {};
                newData[key] = inputs.reduce((acc, input) => acc.concat(input.data.map(item => item[key])), []);
                output.data.push(newData);
            });

            resolve(output);
        } catch (error) {
            reject(error);
        }
    });
};

// Example usage:
async function main() {
    try {
        const output = await integrateInputs(input1, input2, input3,input4,input5);
        console.log(JSON.stringify(output, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
