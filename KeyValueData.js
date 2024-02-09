/*
You can structure your data in such a way that each specific section has its own set of key-value pairs, and you can retrieve all key-value pairs for a specific section by providing its name. Here's how you can do it */

class KeyValueData {
  constructor() {
    this.data = {
      section1: {
        key1: 'value1',
        key2: 'value2'
      },
      section2: {
        key3: 'value3',
        key4: 'value4'
      },
      section3: {
        key5: 'value5',
        key6: 'value6'
      }
    };
  }

  // Method to get all key-value pairs for a specific section
  getSection(sectionName) {
    return this.data[sectionName] || null;
  }

  // Getter method to access the data object
  getData() {
    return this.data;
  }
}

// Example usage
const keyValueInstance = new KeyValueData();

// Access all key-value pairs for a specific section
console.log('Section 1:', keyValueInstance.getSection('section1'));
console.log('Section 2:', keyValueInstance.getSection('section2'));
console.log('Section 3:', keyValueInstance.getSection('section3'));
