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

const mapFields = {
  field: "field",
  City: "city",
  operator: "operator",
};

// Ensure recordgeopolicitical exists and has the same length as other arrays
if (
  !inputJSON.fieldwithcountry.some(
    (obj) => obj.recordgeopolicitical && obj.recordgeopolicitical.length === 3
  )
) {
  throw new Error("Missing or invalid 'recordgeopolicitical' array");
}

inputJSON.fieldwithcountry.forEach((obj, index) => {
  const fieldKey = mapFields[Object.keys(obj)[0]];
  const fieldValues = obj[fieldKey];
  const recordgeopoliciticalValues = inputJSON.fieldwithcountry[3].recordgeopolicitical;

  const transformedValues = fieldValues.map((fieldValue, i) => {
    return `{"${fieldKey}=${fieldValue},recordgeopolicitical=${recordgeopoliciticalValues[i]}"}`;
  });

  outputJSON.fieldwithcountry.push({ [fieldKey]: transformedValues });
});

console.log(outputJSON);
