const transformDataAsync = async (input) => {
    return new Promise((resolve, reject) => {
        try {
            const output = { data: [] };

            // Check if input data is empty or not an array
            if (!Array.isArray(input.data) || input.data.length === 0) {
                resolve(output);
            }

            // Get the keys present in the first object of the data array
            const keys = Object.keys(input.data[0]);

            // Iterate through each key and construct the output object
            keys.forEach(key => {
                const newData = {};
                newData[key] = input.data.map(item => item[key]);
                output.data.push(newData);
            });

            resolve(output);
        } catch (error) {
            reject(error);
        }
    });
};

// Example usage:
const input = {
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

async function main() {
    try {
        const output = await transformDataAsync(input);
        console.log(JSON.stringify(output, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
