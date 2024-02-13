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

const transformData = (input) => {
    const output = { data: [] };

    // Iterate through the keys of the first object to create the structure
    const keys = Object.keys(input.data[0]);

    // Create a new object for each key
    keys.forEach(key => {
        const newData = {};
        newData[key] = input.data.map(item => item[key]);
        output.data.push(newData);
    });

    return output;
};

const output = transformData(input);
console.log(JSON.stringify(output, null, 2));
