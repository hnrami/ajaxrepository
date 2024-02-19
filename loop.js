// Iterate over each object in the "fieldwithcountry" array
input.fieldwithcountry.forEach(item => {
    // Iterate over each key-value pair in the object
    Object.entries(item).forEach(([key, value]) => {
        // Skip the "recordgeopolicitical" field
        if (key !== 'test') {
            // Initialize the array if it doesn't exist
            if (!fieldData[key]) {
                fieldData[key] = [];
            }
            // Push the field-value pair to the corresponding array
            fieldData[key].push(`{${key}=${value},test=${item.test}}`);
        }
    });
});
