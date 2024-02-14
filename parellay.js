async function fetchData1() {
    // Simulate fetching data asynchronously
    return new Promise(resolve => {
        setTimeout(() => {
            resolve("Data from fetchData1");
        }, 1000); // Simulated delay of 1 second
    });
}

async function fetchData2() {
    // Simulate fetching data asynchronously
    return new Promise(resolve => {
        setTimeout(() => {
            resolve("Data from fetchData2");
        }, 2000); // Simulated delay of 2 seconds
    });
}

async function fetchData3() {
    // Simulate fetching data asynchronously
    return new Promise(resolve => {
        setTimeout(() => {
            resolve("Data from fetchData3");
        }, 1500); // Simulated delay of 1.5 seconds
    });
}

async function getAllData() {
    try {
        // Call all the asynchronous functions in parallel using Promise.all()
        const [data1, data2, data3] = await Promise.all([fetchData1(), fetchData2(), fetchData3()]);
        
        // Combine the data as needed
        const combinedData = {
            data1: data1,
            data2: data2,
            data3: data3
        };

        // Return the combined data
        return combinedData;
    } catch (error) {
        // Handle errors
        console.error('Error:', error);
        throw error; // Re-throw the error for handling at the caller level if necessary
    }
}

// Example usage:
getAllData()
    .then(combinedData => {
        console.log(combinedData);
    })
    .catch(error => {
        console.error('Error:', error);
    });
