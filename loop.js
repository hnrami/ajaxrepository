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
  fieldMap[fieldName.toLowerCase()] = fieldName;
});

// Find the index of the object containing the 'recordgeopolicitical' key
const recordGeopoliticalIndex = inputJSON.fieldwithcountry.findIndex(
  (obj) => "recordgeopolicitical" in obj
);

if (recordGeopoliticalIndex === -1) {
  throw new Error("Missing 'recordgeopolicitical' array in input JSON");
}

// Ensure 'recordgeopolicitical' array exists and has the same length as other arrays
if (!inputJSON.fieldwithcountry[recordGeopoliticalIndex].recordgeopolicitical) {
  throw new Error("Invalid 'recordgeopolicitical' array");
}

inputJSON.fieldwithcountry.forEach((obj, index) => {
  const fieldKey = fieldMap[Object.keys(obj)[0].toLowerCase()];
  const fieldValues = obj[fieldKey];
  const recordgeopoliciticalValues = inputJSON.fieldwithcountry[
    recordGeopoliticalIndex
  ].recordgeopolicitical;

  const transformedValues = fieldValues.map((fieldValue, i) => {
    return `{"${fieldKey}=${fieldValue},recordgeopolicitical=${recordgeopoliciticalValues[i]}"}`;
  });

  outputJSON.fieldwithcountry.push({ [fieldKey]: transformedValues });
});

console.log(outputJSON);
