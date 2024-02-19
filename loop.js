const inputJSON = {
  fieldwithcountry: [
    { field: ["E1234", "E12355", "E12366"] },
    { City: ["NYK", "NJ", "SANF"] },
    { operator: ["t1", "t2", "t3"] },
    { recordgeopolicitical: ["USA", "NZ", "AUS"] },
  ],
};

const outputJSON = {
  fieldwithcountry: [],
};

// Dynamically determine field names and map them
const fieldNames = Object.keys(inputJSON.fieldwithcountry[0]);
const fieldMap = {};
fieldNames.forEach((fieldName) => {
  fieldMap[fieldName.toLowerCase()] = fieldName; // Convert to lowercase for consistency
});

// Ensure recordgeopolicitical exists and has the same length as other arrays
if (
  !inputJSON.fieldwithcountry.some(
    (obj) => obj.recordgeopolicitical && obj.recordgeopolicitical.length === 3
  )
) {
  throw new Error("Missing or invalid 'recordgeopolicitical' array");
}

inputJSON.fieldwithcountry.forEach((obj, index) => {
  const fieldKey = fieldMap[Object.keys(obj)[0].toLowerCase()];
  const fieldValues = obj[fieldKey];
  const recordgeopoliciticalValues = inputJSON.fieldwithcountry[3].recordgeopolicitical;

  const transformedValues = fieldValues.map((fieldValue, i) => {
    return `{"${fieldKey}=${fieldValue},recordgeopolicitical=${recordgeopoliciticalValues[i]}"}`;
  });

  outputJSON.fieldwithcountry.push({ [fieldKey]: transformedValues });
});

console.log(outputJSON);
