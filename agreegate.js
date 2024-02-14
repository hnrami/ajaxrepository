const input1 = {
    "data": [
        {
            "filename": ["abc.txt", "xyz.txt"],
        },
        {
            "city": ["MUM", "ADI"]
        },
        {
            "country": ["IND", "PK"]
        }
    ]
};

const input2 = {
    "data": [
        {
            "filename": ["wer.txt", "sdf.txt"],
        },
        {
            "city": ["KOCHI", "MANLORE"]
        },
        {
            "country": ["NZ", "AUS"]
        }
    ]
};

const input3 = {
    "data": [
        {
            "filename": ["ghj.txt", "iop.txt"],
        },
        {
            "city": ["NYC", "LA"]
        },
        {
            "country": ["USA", "CAN"]
        }
    ]
};

const input4 = {
    "data": [
        {
            "filename": ["hyn.txt", "ukm.txt"],
        },
        {
            "city": ["HYD", "GOA"]
        },
        {
            "country": ["KSR", "BAL"]
        }
    ]
};

const input5 = {
    "data": [
        {
            "filename": ["qaz.txt", "wsx.txt"],
        },
        {
            "city": ["ANND", "ND"]
        }
    ]
};

const mergeInputs = (...inputs) => {
    const output = { data: [{}] };

    // Check if all inputs are in the expected format
    const isValid = inputs.every(input => Array.isArray(input.data));
    if (!isValid) {
        throw new Error('Inputs are not in the expected format');
    }

    inputs.forEach(input => {
        input.data.forEach(item => {
            Object.keys(item).forEach(key => {
                if (!output.data[0][key]) {
                    output.data[0][key] = [];
                }
                output.data[0][key].push(...item[key]);
            });
        });
    });

    return output;
};

// Example usage:
try {
    const output = mergeInputs(input1, input2, input3, input4, input5);
    console.log(JSON.stringify(output, null, 2));
} catch (error) {
    console.error('Error:', error);
}
